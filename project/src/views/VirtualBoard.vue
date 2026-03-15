<script setup lang="ts">
import VitualDesk from '@/components/virtualDesk/index.vue';
import options from '@/stores/options.json'
import { UploadUserFile, ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import {buildExperiment, stopExperiment, startExperiment, sendExpSignal} from '@/api/boardApi'
import { generateTokenService } from '@/api/user'
import { useUserStore } from '@/stores/modules/users'

const decimalData = ref<string[]>(['00000000','00000000','00000000','00000000','00000000','00000000'])
const outputData  = ref<string[]>(['--------','--------','--------','--------','--------','--------'])
const ledData     = ref<number[]>(Array(20).fill(0))

interface Row {
  signal: string
  pins: string[][]     // 纯二维数组，每个子数组就是一条完整路径
}

const uploadDisabled = ref(false);  
const deskRef = ref<InstanceType<typeof VitualDesk>>()
const clk = ref('')
const isBuilding = ref(false)
const isStarting = ref(false)
const userStore = useUserStore()

const inputRows = ref<Row[]>([
  { signal: '', pins: [['']] }
]);

const outputRows = ref<Row[]>([
  { signal: '', pins: [['']] }
]);

const inputOptions = options.inputOptions;
const outputOptions = options.outputOptions;

const addInputRow = () => {
  console.log('put')
  inputRows.value.push({
    signal: '',
    pins: [['']]
  });
 };

const removeInputRow = (rowIndex: number) => {
  inputRows.value.splice(rowIndex, 1); // 使用 splice 删除指定索引的行
};

const addInputChain = (rowIndex: number) => {
  // 只在添加的项不为 null 或空字符串时才添加
  if (inputRows.value[rowIndex].pins.at(-1)?.[0] !== '') {
    inputRows.value[rowIndex].pins.push(['']);
  }
};

const removeInputChain = (rowIndex: number) => {
  inputRows.value[rowIndex].pins.pop();
};

const addOutputRow = () => {
  outputRows.value.push({
    signal: '',
    pins: [['']]
  });
};

const removeOutputRow = (rowIndex: number) => {
  outputRows.value.splice(rowIndex, 1); // 使用 splice 删除指定索引的行
};

const addOutputChain = (rowIndex: number) => {
  // 只在添加的项不为 null 或空字符串时才添加
  if (outputRows.value[rowIndex].pins.at(-1)?.[0] !== '') {
    outputRows.value[rowIndex].pins.push(['']);
  }
};

const removeOutputChain = (rowIndex: number) => {
  outputRows.value[rowIndex].pins.pop();
};

const fileList = ref<UploadUserFile[]>(
  []
);

let changeTimer: number | null = null;

function handleChange(_file: UploadUserFile, uploadFiles: UploadUserFile[]) {
  // 每来一次 change，都重置定时器
  if (changeTimer) window.clearTimeout(changeTimer);

  // 延迟 100ms 后执行真正的验证逻辑
  changeTimer = window.setTimeout(() => {
    // 1. 拿到所有原生 File 对象
    const raws = uploadFiles
      .map(f => f.raw as File)
      .filter(Boolean);

    // 2. 看看有没有非 .v 文件
    const badFiles = raws.filter(f => !f.name.toLowerCase().endsWith('.v'));

    if (badFiles.length) {
      // 3a. 有一票否决的，整批取消
      uploadFiles.splice(0, uploadFiles.length);
      fileList.value.splice(0, fileList.value.length);
      ElMessageBox.alert(
        '文件中包含非 .v 文件（已全部取消）：\n' +
          badFiles.map(f => `• ${f.name}`).join('\n'),
        '文件格式错误',
        { confirmButtonText: '我知道了', type: 'error' }
      );
    } else {
      // 3b. 全都是 .v，重置旧列表，一次性添加所有
      fileList.value = raws.map(f => ({
        name:       f.name,
        percentage: 0,
        status:     'ready' as const,
        size:       f.size,
        raw:        f,
        uid:        Date.now() + Math.random()
      }));
      ElMessageBox.alert(
        `已成功添加 ${raws.length} 个 .v 文件`,
        '上传成功',
        { confirmButtonText: '确定' }
      );
    }

    // 清掉定时器引用，下次才能重建
    changeTimer = null;
  }, 100);
}

const isStart = ref(false)
const isBuild = ref(false)

const ensureBoardToken = async () => {
  if (userStore.boardToken) return true
  try {
    const tokenResp = await generateTokenService()
    const headerToken =
      tokenResp.headers?.token ||
      tokenResp.headers?.['x-token'] ||
      tokenResp.headers?.['vboard-token'] ||
      tokenResp.headers?.['board-token']
    const token =
      tokenResp.data?.result?.tokenValue ||
      tokenResp.data?.result?.token ||
      tokenResp.data?.result?.tokenString ||
      tokenResp.data?.tokenValue ||
      tokenResp.data?.token ||
      headerToken ||
      tokenResp.data?.msg
    if (!token || typeof token !== 'string') {
      throw new Error('未获取到有效实验 token')
    }
    userStore.setBoardToken(token)
    return true
  } catch (err: any) {
    ElMessage.error(err?.msg || err?.message || '板卡 token 生成失败')
    return false
  }
}

onMounted(() => {
  ensureBoardToken()
})

const updateDisplay = (d: Record<string, any>) => {
   // ① 更新 LED 灯
   ledData.value = []
   for (let i = 0; i < 20; i++) {
     const key = `L${String(i).padStart(2,'0')}`
     ledData.value.push(d[key])
   }

   // ② 更新 小数点 数据 （DP00..DP05）
   for (let i = 0; i < 6; i++) {
     const key = `DP${String(i)}`
     decimalData.value[i] = d[key]
   }

   // ③ 更新 数码管 显示 （OUTPUT00..OUTPUT05）
   for (let i = 0; i < 6; i++) {
     const key = `OUTPUT${String(i)}`
     outputData.value[i] = d[key]
   }
 }

 function resetDisplay() {
    ledData.value     = Array(20).fill(0)
    decimalData.value = Array(6).fill('00000000')
    outputData.value  = Array(6).fill('--------')
}

function getBindData() {
  return {
    CLK: clk.value,
    inputRows: inputRows.value.map(row => ({
      signal: row.signal,
      pins: row.pins
        // 只保留那些子数组第一个元素不为空的
        .filter(path => path.length > 0 && path[0] !== '')
        // 把每条完整路径收尾的值拿出来
        .map(path => path[path.length - 1])
    })),
    outputRows: outputRows.value.map(row => ({
      signal: row.signal,
      pins: row.pins
        .filter(path => path.length > 0 && path[0] !== '')
        .map(path => path[path.length - 1])
    }))
  }
}

// —— 实现下载的方法 —— 
const downloadBind = () => {
  const data = getBindData()
  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'bind.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success('已生成并下载 bind.json')
}

// 1. 工具函数：检查某条完整路径 path 在 options 树里是否合法
const isValidPath = function (
  options: { value: string; children?: any[] }[],
  path: string[]
): boolean {
  let level = options
  for (const segment of path) {
    const node = level.find(o => o.value === segment)
    if (!node) return false
    level = node.children ?? []
  }
  return true
}

// 结构校验函数
function validateJsonFormat(data: any): { valid: true } | { valid: false; error: string } {
  if (typeof data !== 'object' || data === null) {
    return { valid: false, error: '上传的不是合法的 JSON 对象' };
  }
  if (typeof data.CLK !== 'string') {
    return { valid: false, error: '缺少或无效的 "CLK" 字段，应为字符串' };
  }
  if (!Array.isArray(data.inputRows)) {
    return { valid: false, error: '缺少或无效的 "inputRows"，应为数组' };
  }
  if (!Array.isArray(data.outputRows)) {
    return { valid: false, error: '缺少或无效的 "outputRows"，应为数组' };
  }
  for (const row of data.inputRows) {
    if (typeof row.signal !== 'string') {
      return { valid: false, error: 'inputRows 中每一项都应包含字符串类型的 signal' };
    }
    if (!Array.isArray(row.pins)) {
      return { valid: false, error: 'inputRows 中每一项都应包含数组类型的 pins' };
    }
    for (const pin of row.pins) {
      if (
        typeof pin !== 'string' &&
        !(Array.isArray(pin) && pin.every(p => typeof p === 'string'))
      ) {
        return { valid: false, error: 'inputRows 的 pins 中，每个元素应为 string 或 string[]' };
      }
    }
  }
  for (const row of data.outputRows) {
    if (typeof row.signal !== 'string') {
      return { valid: false, error: 'outputRows 中每一项都应包含字符串类型的 signal' };
    }
    if (!Array.isArray(row.pins)) {
      return { valid: false, error: 'outputRows 中每一项都应包含数组类型的 pins' };
    }
    for (const pin of row.pins) {
      if (
        typeof pin !== 'string' &&
        !(Array.isArray(pin) && pin.every(p => typeof p === 'string'))
      ) {
        return { valid: false, error: 'outputRows 的 pins 中，每个元素应为 string 或 string[]' };
      }
    }
  }
  return { valid: true };
}


// 2. 批量校验 rows 里所有路径
const validateRows = function (
  rows: Row[],
  options: typeof inputOptions,
  typeName: '输入' | '输出'
): boolean {
  for (const { signal, pins } of rows) {
    for (const path of pins) {
      // 跳过占位空 ['']
      if (!path.length || path[0] === '') continue

      if (!isValidPath(options, path)) {
        ElMessageBox.alert(
          `${typeName}信号 "${signal}" 中的引脚 "${path.join(' → ')}" 不存在`,
          '绑定错误',
          { type: 'error' }
        )
        return false
      }
    }
  }
  return true
}

// 用来拿到 <input type="file">
const fileInputRef = ref<HTMLInputElement | null>(null)

// 触发文件选择对话框
const triggerUpload = () => {
  fileInputRef.value?.click()
}

/**
 * 如果 path 是单字符串，尝试在 options 里找到它属于哪个 group
 * 返回 [group.value, leaf]；找不到就返回原串
 */
 function completePath(
  options: { value: string; children?: { value: string }[] }[],
  pin: string
): string[] {
  for (const group of options) {
    if (group.children?.some(c => c.value === pin)) {
      return [group.value, pin];
    }
  }
  // 没找到就给它自己，后面校验会判错
  return [pin];
}

// 读取并解析 JSON，然后绑定到状态里
const handleUploadJson = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files?.length) return;

  try {
    await ElMessageBox.confirm(
      '上传后的逻辑会替换掉当前绑定逻辑，是否确定？',
      '确认上传',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
  } catch {
    (e.target as HTMLInputElement).value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    let raw: any;
    try {
      raw = JSON.parse(reader.result as string);
    } catch {
      ElMessageBox.alert('JSON 解析失败，请检查文件格式是否正确', '格式错误', { type: 'error' });
      return;
    }

    // —— 1. 先做格式校验 —— 
    const fmt = validateJsonFormat(raw);
    if (!fmt.valid) {
      ElMessageBox.alert(fmt.error, '格式错误', { type: 'error' });
      return;
    }

    // —— 2. 再做之前的「补全→业务校验→赋值」流程 —— 
    const data = raw as {
      CLK: string;
      inputRows: { signal: string; pins: (string|string[])[] }[];
      outputRows: { signal: string; pins: (string|string[])[] }[];
    };

    // 把单值 pin 补成完整路径
    const newInputRows: Row[] = data.inputRows.map(r => ({
      signal: r.signal,
      pins: r.pins.map(pin =>
        Array.isArray(pin) ? pin : completePath(inputOptions, pin)
      )
    }));
    const newOutputRows: Row[] = data.outputRows.map(r => ({
      signal: r.signal,
      pins: r.pins.map(pin =>
        Array.isArray(pin) ? pin : completePath(outputOptions, pin)
      )
    }));

    // 再做一次业务校验（路径合法性）
    if (
      !validateRows(newInputRows, inputOptions, '输入') ||
      !validateRows(newOutputRows, outputOptions, '输出')
    ) {
      return;
    }

    // —— 3. 全部通过，才真正赋值并渲染 —— 
    clk.value = data.CLK;
    inputRows.value = newInputRows;
    outputRows.value = newOutputRows;
    ElMessage.success('已加载并绑定信号数据');
  };
  reader.readAsText(files[0]);
  // 重置文件选择，允许同一文件重复上传
  (e.target as HTMLInputElement).value = '';
};


const buildExp = async() => {
  // ElMessageBox.alert(
  //   errMsg,
  //     '错误',
  //     { 
  //       customClass: 'wide-error-box',
  //       type: 'error' 
  //     }
  //   );
  const bindData = {
    CLK: clk.value,
    inputRows: inputRows.value.map(row => ({
      signal: row.signal,
      pins: row.pins
        .filter(path => path.length > 0 && path[0] !== '')
        .map(path => path[path.length - 1])
    })),
    outputRows: outputRows.value.map(row => ({
      signal: row.signal,
      pins: row.pins
        .filter(path => path.length > 0 && path[0] !== '')
        .map(path => path[path.length - 1])
    }))
  };
  const formData = new FormData();
  const bindBlob = new Blob([JSON.stringify(bindData)], { type: 'application/json' });

  if (fileList.value.length > 0 && fileList.value[0].raw) {
    for (let i = 0; i < fileList.value.length; i++) {
      const file = fileList.value[i].raw;
      formData.append('verilogFile', file);  // 名称相同，append 多次
    }
  } else {
    ElMessageBox.alert('请选择 .v 文件', '文件格式错误', {
      confirmButtonText: '确定',
      type: 'error'
    });

    return;
  }

  formData.append('bindFile', bindBlob, 'bind.json');
  const tokenReady = await ensureBoardToken()
  if (!tokenReady) return
  if (isBuilding.value) return            // 已经在构建中，就不重复触发
  isBuilding.value = true
    /* ---------- 4. 调用后端接口 ---------- */
  try {
    const { data } = await buildExperiment(formData);   // axios 默认把响应体包在 data
    if (data.code === 0) {
      // === 构建成功 ===
      isBuild.value = true;                             // ✅ 允许点击“开始实验”
      ElMessage.success('板卡构建成功！');
      uploadDisabled.value = true;
    } else {
      // === 后端返回失败（HTTP 200）===
      throw new Error(data.msg || '板卡构建失败');
    }
  } catch (err: any) {
    // === 网络 / 服务器异常 ===
    isBuild.value = false;                              // 仍处于“未构建”状态
    ElMessageBox.alert(
      err.msg || '板卡构建失败，请检查网络或服务器',
      '错误',
      { 
        customClass: 'wide-error-box',
        type: 'error' 
      }
    );
  } finally {
    isBuilding.value = false             // 无论成功失败，都恢复按钮可点
  }
}

/** === 开始实验 === */
const startExp = async () => {
  if (!isBuild.value) {
    ElMessage.error('请先成功构造板卡，再开始实验');
    return;
  }
  if (isStarting.value) return
  const tokenReady = await ensureBoardToken()
  if (!tokenReady) return
  isStarting.value = true
  try {
    const resp = await startExperiment();
    if (resp.data.code !== 0) throw new Error(resp.data.msg || '开始实验失败');
    isStart.value = true;
    ElMessage.success('实验已开始');

     // 拿到后端 data，更新界面
     const d = resp.data.result.data as Record<string, any>;
     updateDisplay(d);
  } catch (err) {
    ElMessage.error('开始实验出错，请稍后重试');
  } finally {
    isStarting.value = false
  }
};

const endExp = () => {
  stopExperiment()
    .then(() => {
      isStart.value = !isStart.value;
      isBuild.value = !isBuild.value
      uploadDisabled.value = !uploadDisabled.value
      resetDisplay()
    })
    .catch((error) => {
      console.error('停止实验出错：', error);
    });
}

const clkFlag = ref(0)
const clkButtonLabel = computed(() => (clkFlag.value === 0 ? '↓' : '↑'))
const clkTooltip = computed(() => (clkFlag.value === 0 ? '下降沿' : '上升沿'))

const sendSignalTest = async () => {
  const tokenReady = await ensureBoardToken()
  if (!tokenReady) return
  clkFlag.value = clkFlag.value === 1 ? 0 : 1;

  const payload = {
    data: {
      CLK: clkFlag.value,
    }
  }
  console.log(payload)
  const resp = await sendExpSignal(payload)
  if (resp.data.code !== 0) {
    // 错误处理
    return
  }

  // 拿到后端 data（可能是 {}）
  const d = resp.data.result.data as Record<string, any> || {}

  // 只有当 data 对象里至少有一个 key 时才更新
  if (Object.keys(d).length > 0) {
    updateDisplay(d)
  }
}

const sendSignal = async () => {
  const tokenReady = await ensureBoardToken()
  if (!tokenReady) return
  const { button, sw, input } = deskRef.value?.getAllStates() || {}

  // 你自己的格式化，比如把 input 里每行拼成字符串
  const inputFields = Object.entries(input).reduce((acc, [k,v])=>{
    acc[k] = v; // 或者做你自己的拼接
    return acc
  }, {} as Record<string,string>)

  const payload = {
    data: {
      CLK: clk.value,
      ...sw,
      ...button,
      ...inputFields
    }
  }

  const resp = await sendExpSignal(payload)
  if (resp.data.code !== 0) {
    // 错误处理
    return
  }

  // 拿到后端 data（可能是 {}）
  const d = resp.data.result.data as Record<string, any> || {}

  // 只有当 data 对象里至少有一个 key 时才更新
  if (Object.keys(d).length > 0) {
    updateDisplay(d)
  }
  // 否则什么都不做，保持上一次的状态
}


</script>

<template>
  <input
  type="file"
  accept=".json"
  ref="fileInputRef"
  style="display: none"
  @change="handleUploadJson"
/>
  <div style="width: 100%; height: 100%" class="backGround">
    <div class="bdPart">
      <div class="VirDeskPart">
        <img src="@/assets/virtualDeskBg.png" alt="BackGround">
        <div class="virDeskOutline">
          <VitualDesk
            :ledData="ledData"
            :decimalData="decimalData"
            :outputData="outputData"
            ref="deskRef"
          />
        </div>
      </div>
      <div class="bindingPart">
        <div class="bindBox">
          <div class="bindHeader">
            <span>
              FPGA 远程实验平台
            </span>
          </div>
          <div class="bindClk">
            <div class="wrap">
              <span>
                CLK:
              </span>
              <el-input
              v-model="clk" 
              class="clkInput"
              >

              </el-input>
              <el-tooltip :content="clkTooltip" placement="bottom" popper-class="bind-tooltip">
                <el-button @click="sendSignalTest" type="warning" plain class="clk-action clk-arrow">
                  {{ clkButtonLabel }}
                </el-button>
              </el-tooltip>
              <el-tooltip content="下载当前引脚绑定逻辑" placement="bottom" popper-class="bind-tooltip">
                <el-button type="warning" plain @click="downloadBind" class="clk-action">下载bind</el-button>
              </el-tooltip>
              <el-tooltip content="上传引脚绑定文件" placement="bottom" popper-class="bind-tooltip">
                <el-button type="warning" plain @click="triggerUpload" class="clk-action">上传bind</el-button>
              </el-tooltip>
            </div>
          </div>
          <div class="bind">
            <div class="putTitle">
              <span>
                选择绑定Input信号
              </span>
            </div>
            <div class="putScroll">
              <el-button @click="addInputRow" :icon="Plus" class="rowPlus"></el-button>
              <el-scrollbar height="100%">
                <div
                  v-for="(row, rowIndex) in inputRows"
                  :key="rowIndex"
                  class="row"
                >
                  <!-- 左侧：input 和对应的加号 -->
                  <div class="put-part">
                    <el-icon class="close-icon" style="font-size: 12px;" @click="removeInputRow(rowIndex)" ><Close /></el-icon>
                    <div>
                      <span>
                        Input:
                      </span>
                      <el-input v-model="row.signal" type="text" style="width: 50%"/>
                    </div>
                  </div>
                  
                  <!-- 右侧：链式选择器和对应的加号 -->
                  <div class="chain-part">
                    <!-- 遍历该行的所有链式选择器 -->
                    <div>
                      <span style="font-size: 16px;">
                        引脚：
                      </span>
                    </div>
                    <div style="display: flex; flex-direction: column; width: 46%;">
                      <div
                        v-for="(chain, chainIndex) in row.pins"
                        :key="chainIndex"
                        class="chain-item"
                      >
                        <el-cascader v-model="row.pins[chainIndex]" :show-all-levels="false" clearable :options="inputOptions" style="width: 100%;" placeholder=" " />
                      </div>
                    </div>
                    <!-- 点击加号在当前行新增一个链式选择器 --> 
                     <div style="width: 30%;height: 100%;">
                      <el-button @click="addInputChain(rowIndex)" :icon="Plus" class="chainPlus"></el-button>
                      <el-button @click="removeInputChain(rowIndex)" :icon="Minus" :disabled="row.pins.length <= 1" class="chainMinus"></el-button>
                     </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="bind">
            <span class="putTitle">
              <span>
                选择绑定Output信号
              </span>
            </span>
            <div class="putScroll">
              <el-button @click="addOutputRow" :icon="Plus" class="rowPlus"></el-button>
              <el-scrollbar height="100%">
                <div
                  v-for="(row, rowIndex) in outputRows"
                  :key="rowIndex"
                  class="row"
                >
                  <!-- 左侧：input 和对应的加号 -->
                  <div class="put-part">
                    <div style="width: 100%; height: 36px;">
                      <el-icon class="close-icon" style="font-size: 12px;" @click="removeOutputRow(rowIndex)" ><Close /></el-icon>
                      <span style="font-size: 14px;">
                        Output:
                      </span>
                      <el-input v-model="row.signal" type="text" style="width: 44%"/>
                    </div>
                    <!-- 点击加号新增一行
                    <div style="width: 100%; height: 26px;">
                      <el-button @click="addOutputRow" :icon="Plus" class="rowPlus"></el-button>
                      <el-button @click="removeOutputRow(rowIndex)" :icon="Minus" :disabled="outputRows.length <= 1" class="rowMinus"></el-button>
                    </div> -->
                  </div>
                  
                  <!-- 右侧：链式选择器和对应的加号 -->
                  <div class="chain-part">
                    <!-- 遍历该行的所有链式选择器 -->
                    <div>
                      <span style="font-size: 16px;">
                        引脚：
                      </span>
                    </div>
                    <div style="display: flex; flex-direction: column; width: 46%;">
                      <div
                        v-for="(chain, chainIndex) in row.pins"
                        :key="chainIndex"
                        class="chain-item"
                      >
                        <el-cascader   class="mini-casc" v-model="row.pins[chainIndex]" :show-all-levels="false" clearable :options="outputOptions" style="width: 100%;" placeholder=" " />
                      </div>
                    </div>
                    <!-- 点击加号在当前行新增一个链式选择器 -->
                    <div style="width: 30%;height: 100%;">
                      <el-button @click="addOutputChain(rowIndex)" :icon="Plus" class="chainPlus"></el-button>
                      <el-button @click="removeOutputChain(rowIndex)" :icon="Minus" :disabled="row.pins.length <= 1" class="chainMinus"></el-button>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="bindFoot">
            <el-upload
            :file-list="fileList"
            multiple
            :before-upload="() => false"
            :disabled="uploadDisabled"
            :on-change="handleChange"
            class="UploadBt"
            >
              <el-button style="width: 100%;height: 100%; font-size: 20px;" class="upload-btn" @click="onUploadClick" :disabled="uploadDisabled" v-if="!isStart || !isBuild">上传.V</el-button>
              <el-button style="width: 100%;height: 100%; font-size: 20px;" class="send-btn" @click="sendSignal" v-if="isStart && isBuild">下传信号</el-button>
            </el-upload>
            <el-button class="expBt" 
            :loading="isBuilding"
            :disabled="isBuilding || isStart"
            v-if="!isStart && !isBuild" 
            @click="buildExp">
              构造板卡
            </el-button>
            <el-button class="expBt" 
            :loading="isStarting"
            :disabled="isStarting || !isBuild"
            v-if="!isStart && isBuild" 
            @click="startExp">
              开始实验
            </el-button>
            <el-button class="expBt" v-if="isStart && isBuild" @click="endExp">
              结束实验
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <span>网络空间安全省级实验教学示范中心</span>
  </div>
</template>

<style lang="scss" scoped>
.backGround{
  background-image: url('../../src/assets/bj.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  .bdPart{
    width: 96%;
    height: 85%;
    background-color: white;
    border-radius: 30px;
    margin: 0 auto;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;
    align-items: center;
    border: 2px dashed #9E3419;
    .VirDeskPart{
      width: 69%;
      height: 95%;
      position: relative;
      .virDeskOutline{
        width: 96%;
        height: 94%;
        position: absolute;
        left: 2%;
        top: 3%;
      }
      >img{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    .bindingPart{
      width: 26%;
      height: 95%;
      display: flex;
      flex-direction: row-reverse;
      .bindBox{
        width: 100%;
        height: 100%;
        border-radius: 30px;
        .bindHeader{
          width: 100%;
          height: 10%;
          display: flex;
          justify-content: center;
          margin-top: 6%;
          > span{
            font-size: 30px;
            font-weight: 400;
          }
        }
        .bindClk{
          width: 100%;
          height: 6%;
          margin-bottom: 4%;
          background-color: #FFC48A;
          .wrap{
            width: 90%;
            height: 100%;
            margin: 0 auto;
            display: flex;
            align-items: center;
            > span{
              margin-right: 2%;
              font-size: 18px;
              font-weight: 500;
            }
            > .el-input{
              width: 40%;
              height: 70%;
            }
            > .el-button,
            > .el-tooltip{
              width: 20%;
              height: 80%;
              margin-left: auto;
            }
            > .el-tooltip .el-button{
              width: 100%;
              height: 100%;
            }
            .clk-arrow{
              width: 10%;
              min-width: 10%;
              padding: 0;
            }
          }
        }
        .bind{
          width: 100%;
          height: 34%;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .putTitle{
            width: 100%;
            height: 15%;
            background-color: rgba(236, 175, 114, 0.59);
            position: relative;
            > span{
              position: absolute;
              left: 5%;
              top: 10%;
              font-size: 18px;
            }
          }
          .putScroll{
            width: 100%;
            height: 80%;
            margin: 0 auto;
            position: relative;
            .rowPlus{
                width: 7%; 
                height: 14%; 
                position: absolute;
                bottom: 1%;
                left: 47.5%;
                z-index: 10; 
                background-color: #ECAF72;
                color: white;
            }
            .row {
              display: flex;
              align-items: flex-start;
              margin-bottom: 15px;
              width: 100%;
              .put-part {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40%;
                .rowMinus{
                  width: 20%; 
                  height: 100%; 
                  background-color: #ECAF72;
                  color: white;
                  margin-left: 5%;
                }
                span{
                  font-size: 16px;
                }
                button{
                  margin: 1px;
                }
              }
              .chain-part {
                display: flex;
                align-items: flex-start;
                width: 60%;
                .chainPlus{
                  width: 47%; 
                  height: 28px; 
                  margin-left: 3%; 
                  background-color: #FC654E; 
                  color: white;
                }
                .chainMinus{
                  width: 47%; 
                  height: 28px; 
                  margin-left: 3%; 
                  background-color: #D4DBA1; 
                  color: white;
                }
                .chain-item{
                  width: 100%;
                }
                > button{
                  margin: 1px;
                }
              }
            }
          }
        }
        .bindFoot{
          width: 100%;
          height: 15%;
          display: flex;
          justify-content: space-around;
          .UploadBt{
            width: 35%;
            height: 40%;
            .el-button.upload-btn {
              background: linear-gradient(45deg, rgb(228, 131, 34), rgb(226, 182, 93));
              color: white;
            }
            .el-button.upload-btn:disabled {
              background: #ccc;
              color: #888;
            }
            .el-button.send-btn {
              background: linear-gradient(45deg, #4CAF50, #8BC34A);
              color: white;
            }
          }
          .expBt{
            width: 35%;
            height: 40%;
            font-size: 20px;
            color: white;
            background: linear-gradient(45deg, rgb(252, 101, 78), rgb(252, 123, 67));
          }
        }
      }
    }
  }
  

  
  > span{
    position: absolute;
    bottom: 2%;
    left: 35%;
    font-size: 30px;
    color: black;
    font-family: "KaiTi",       /* Windows 中对应“楷体” */ 
               "楷体",        /* 中文名称回退 */
               "楷体_GB2312",/* 兼容部分老系统字体名 */
               serif;        /* 最后再回退到衬线字体 */
  }

}
:deep(.el-upload) {
  width: 100%;
  height: 100%;
}

:deep(.el-button) {
  padding: 0;
}

:global(.bind-tooltip) {
  font-size: 12px;
  line-height: 1.2;
  padding: 4px 8px;
  max-width: 220px;
}

:deep(.mini-casc .el-input__inner) {
  font-size: 11px !important;
  line-height: 1;              // 避免文字垂直居中时产生额外高度
}


:deep(.clkInput .el-input__wrapper){
  background-color: #FDE6D5 !important;
  color: white !important;
}

/* 1. 默认隐藏所有的关闭图标 */
.close-icon {
  opacity: 0;
  transition: opacity 0.2s;
  /* 如果想要完全移除布局影响，可用 visibility:hidden + visibility:visible */
  /* visibility: hidden; */
}

/* 2. 当鼠标移到 .row 上时，显示该行里的关闭图标 */
.row:not(:only-child):hover .close-icon {
  opacity: 1;
  cursor: pointer;
  /* 或者 visibility: visible; */
}

</style>
