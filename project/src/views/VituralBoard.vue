<script setup lang="ts">
import VitualDesk from '@/components/virtualDesk/index.vue';
import options from '@/stores/options.json'
import { UploadUserFile, ElMessage, ElMessageBox } from 'element-plus';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import {buildExperiment, stopExperiment, startExperiment, sendExpSignal} from '@/api/boardApi'

const decimalData = ref<string[]>(['00000000','00000000','00000000','00000000','00000000','00000000'])
const outputData  = ref<string[]>(['--------','--------','--------','--------','--------','--------'])
const ledData     = ref<number[]>(Array(20).fill(0))

interface Row {
  signal: string;
  pins: string[];
}

const uploadDisabled = ref(false);  
const deskRef = ref<InstanceType<typeof VitualDesk>>()
const clk = ref('')
const isBuilding = ref(false)
const isStarting = ref(false)

const inputRows = ref<Row[]>([
  {
    signal: '',
    pins: ['']
  }
]);

const outputRows = ref<Row[]>([
  {
    signal: '',
    pins: ['']
  }
]);

const inputOptions = options.inputOptions;
const outputOptions = options.outputOptions;

const addInputRow = () => {
  inputRows.value.push({
    signal: '',
    pins: ['']
  });
};

const removeInputRow = (rowIndex: number) => {
  inputRows.value.splice(rowIndex, 1); // 使用 splice 删除指定索引的行
};

const addInputChain = (rowIndex: number) => {
  // 只在添加的项不为 null 或空字符串时才添加
  if (inputRows.value[rowIndex].pins[inputRows.value[rowIndex].pins.length - 1] !== '') {
    inputRows.value[rowIndex].pins.push('');
  }
};

const removeInputChain = (rowIndex: number) => {
  inputRows.value[rowIndex].pins.pop();
};

const addOutputRow = () => {
  outputRows.value.push({
    signal: '',
    pins: ['']
  });
};

const removeOutputRow = (rowIndex: number) => {
  outputRows.value.splice(rowIndex, 1); // 使用 splice 删除指定索引的行
};

const addOutputChain = (rowIndex: number) => {
  // 只在添加的项不为 null 或空字符串时才添加
  if (outputRows.value[rowIndex].pins[outputRows.value[rowIndex].pins.length - 1] !== '') {
    outputRows.value[rowIndex].pins.push('');
  }
};

const removeOutputChain = (rowIndex: number) => {
  outputRows.value[rowIndex].pins.pop();
};

const fileList = ref<UploadUserFile[]>(
  []
);

const beforeUpload = (file: File) => {
  console.log('File selected:', file);
  if (!file.name.toLowerCase().endsWith('.v')) {
    ElMessageBox.alert('请选择 .v 文件', '文件格式错误', {
      confirmButtonText: '确定',
      type: 'error'
    });
    return false; // 阻止上传
  }
  
  // 手动添加文件到 fileList
  fileList.value.push({
    name: file.name,
    percentage: 0,
    status: 'ready',
    size: file.size,
    raw: file,
    uid: Date.now(), // 生成一个唯一的 uid
  });
  
  ElMessageBox.alert('上传成功', '提示', {
    confirmButtonText: '确定'
  }).then(() => {
    // 当用户点击“确定”后，禁用上传按钮
    uploadDisabled.value = true;
  });

  
  return false;  // 阻止自动上传
};

const isStart = ref(false)
const isBuild = ref(false)

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


const buildExp = async() => {
  const bindData = {
    CLk: clk.value,
    inputRows: inputRows.value.map(row => ({
      signal: row.signal,
      pins: row.pins.filter(pin => pin && pin !== '') // 只保留非 null 和非空字符串的值
    })),
    outputRows: outputRows.value.map(row => ({
      signal: row.signal,
      pins: row.pins.filter(pin => pin && pin !== '') // 只保留非 null 和非空字符串的值
    }))
  };
  const formData = new FormData();
  const bindBlob = new Blob([JSON.stringify(bindData)], { type: 'application/json' });

  if (fileList.value.length > 0 && fileList.value[0].raw) {
    formData.append('verilogFile', fileList.value[0].raw);
  } else {
    ElMessageBox.alert('请选择 .v 文件', '文件格式错误', {
      confirmButtonText: '确定',
      type: 'error'
    });

    return;
  }

  formData.append('bindFile', bindBlob, 'bind.json');  
  if (isBuilding.value) return            // 已经在构建中，就不重复触发
  isBuilding.value = true
    /* ---------- 4. 调用后端接口 ---------- */
  try {
    const { data } = await buildExperiment(formData);   // axios 默认把响应体包在 data
    if (data.code === 0) {
      // === 构建成功 ===
      isBuild.value = true;                             // ✅ 允许点击“开始实验”
      ElMessage.success('板卡构建成功！');
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
      { type: 'error' }
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
      resetDisplay()
    })
    .catch((error) => {
      console.error('停止实验出错：', error);
    });
}

const sendSignal = async () => {
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

onBeforeUnmount(() => {
  if (isStart.value || isBuild.value) {
    endExp();
  }
});


</script>

<template>
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
            </div>
          </div>
          <div class="bind">
            <div class="putTitle">
              <span>
                选择绑定Input信号
              </span>
            </div>
            <div class="putScroll">
              <el-scrollbar height="100%">
                <div
                  v-for="(row, rowIndex) in inputRows"
                  :key="rowIndex"
                  class="row"
                >
                  <!-- 左侧：input 和对应的加号 -->
                  <div class="put-part">
                    <div>
                      <span>
                        Input:
                      </span>
                      <el-input v-model="row.signal" type="text" style="width: 50%"/>
                    </div>
                    <!-- 点击加号新增一行 -->
                    <div style="width: 100%; height: 26px;">
                      <el-button @click="addInputRow" :icon="Plus" class="rowPlus"></el-button>
                      <el-button @click="removeInputRow(rowIndex)" :icon="Minus" :disabled="inputRows.length <= 1" class="rowMinus"></el-button>
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
                    <el-button @click="addInputChain(rowIndex)" :icon="Plus" class="chainPlus"></el-button>
                    <el-button @click="removeInputChain(rowIndex)" :icon="Minus" :disabled="row.pins.length <= 1" class="chainMinus"></el-button>
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
              <el-scrollbar height="100%">
                <div
                  v-for="(row, rowIndex) in outputRows"
                  :key="rowIndex"
                  class="row"
                >
                  <!-- 左侧：input 和对应的加号 -->
                  <div class="put-part" style="width: 40%;height: 66px;">
                    <div style="width: 100%; height: 36px;">
                      <span style="font-size: 16px;">
                        Output:
                      </span>
                      <el-input v-model="row.signal" type="text" style="width: 48%"/>
                    </div>
                    <!-- 点击加号新增一行 -->
                    <div style="width: 100%; height: 26px;">
                      <el-button @click="addOutputRow" :icon="Plus" class="rowPlus"></el-button>
                      <el-button @click="removeOutputRow(rowIndex)" :icon="Minus" :disabled="outputRows.length <= 1" class="rowMinus"></el-button>
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
                        <el-cascader   class="mini-casc" v-model="row.pins[chainIndex]" :show-all-levels="false" clearable :options="outputOptions" style="width: 100%;" placeholder=" " />
                      </div>
                    </div>
                    <!-- 点击加号在当前行新增一个链式选择器 -->
                    <el-button @click="addOutputChain(rowIndex)" :icon="Plus" class="chainPlus"></el-button>
                    <el-button @click="removeOutputChain(rowIndex)" :icon="Minus" :disabled="row.pins.length <= 1" class="chainMinus"></el-button>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="bindFoot">
            <el-upload
            :file-list="fileList"
            multiple
            :before-upload="beforeUpload"
            :disabled="uploadDisabled"
            class="UploadBt"
            >
              <el-button style="width: 100%;height: 100%; font-size: 20px;" class="upload-btn" :disabled="uploadDisabled" v-if="!isStart || !isBuild">上传.V</el-button>
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
    <span>网安学院</span>
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
          width: 90%;
          height: 10%;
          margin: 0 auto;
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
            width: 94%;
            height: 80%;
            margin: 0 auto;
            .row {
              display: flex;
              align-items: flex-start;
              margin-bottom: 15px;
              width: 100%;
              .put-part {
                display: flex;
                flex-direction: column;
                width: 40%;
                .rowPlus{
                  width: 20%; 
                  height: 100%; 
                  background-color: #ECAF72;
                  color: white;
                }
                .rowMinus{
                  width: 20%; 
                  height: 100%; 
                  background-color: #ECAF72;
                  color: white;
                  margin-left: 5%;
                }
                span{
                  font-size: 18px;
                }
                button{
                  margin: 1px;
                }
              }
              .chain-part {
                display: flex;
                align-items: flex-start;
                width: 60%;
                height: 40px;
                .chainPlus{
                  width: 12%; 
                  height: 64%; 
                  margin-left: 3%; 
                  background-color: #FC654E; 
                  color: white;
                }
                .chainMinus{
                  width: 12%; 
                  height: 64%; 
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
    bottom: 1%;
    right: 5%;
    font-size: 35px;
    color: black;
  }

}
::v-deep .el-upload {
  width: 100%;
  height: 100%;
}

::v-deep .el-button {
  padding: 0;
}

:deep(.mini-casc .el-input__inner) {
  font-size: 11px !important;
  line-height: 1;              // 避免文字垂直居中时产生额外高度
}


::v-deep .clkInput .el-input__wrapper{
  background-color: #FDE6D5 !important;
  color: white !important;
}

</style>
