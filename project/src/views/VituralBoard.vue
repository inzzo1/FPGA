<script setup lang="ts">
import VitualDesk from '@/components/virtualDesk/index.vue';
import stateHeader from '@/components/header/stateHeader.vue';
import options from '@/stores/options.json'
import { UploadUserFile, ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import {simulate, stop} from '@/api/boardApi'

let sessionId;

const socket = new WebSocket('ws://your-websocket-server-url');

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'sessionId') {
    sessionId = message.sessionId;  // 假设服务器返回的是这样的结构
    console.log('Session ID:', sessionId);
  }
};

interface Row {
  signal: string;
  pins: string[];
}

const uploadDisabled = ref(false);  

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

const isStart = ref(true)

const startExp = () => {
  const bindData = {
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

  if (sessionId) {
    formData.append('sessionId', sessionId);
  } else {
    ElMessageBox.alert('未获取到 sessionId', '错误', {
      confirmButtonText: '确定',
      type: 'error'
    });
    return;
  }

  formData.append('bindFile', bindBlob, 'bind.json');
  console.log(JSON.stringify(bindData));
  
  simulate(formData)
    .then((response) => {
      console.log('模拟成功:', response);
      
      // 弹出模拟成功的提示框
      ElMessageBox.alert('模拟成功！', '提示', {
        confirmButtonText: '确定',
        type: 'success'
      }).then(() => {
        // 成功后执行的操作（如果有）
        isStart.value = !isStart.value;
      });
    })
    .catch((error) => {
      console.error('模拟失败:', error);
      ElMessageBox.alert('模拟请求失败，请检查网络或服务器状态', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      });
    });
}

const endExp = () => {
  isStart.value = !isStart.value
  stop(sessionId)
    .then(() => {
      isStart.value = !isStart.value;
    })
    .catch((error) => {
      console.error('停止实验出错：', error);
    });
}


</script>

<template>
  <div style="width: 100%; height: 100%" class="backGround">
    <div class="header">
      <stateHeader></stateHeader>
    </div>
    <div class="bdPart">
      <div class="VirDeskPart">
        <img src="@/assets/virtualDeskBg.png" alt="BackGround">
        <!-- <VitualDesk> </VitualDesk> -->
      </div>
      <div class="bindingPart">
        <div class="bindBox">
          <div class="bindHeader">
            <el-upload
            :file-list="fileList"
            multiple
            :before-upload="beforeUpload"
            :disabled="uploadDisabled"
            class="UploadBt"
            >
              <el-button type="warning" style="width: 100%;height: 100%;" :disabled="uploadDisabled">上传.V</el-button>
            </el-upload>
            <el-button type="danger" style="width: 35%;height: 100%;" v-if="isStart" @click="startExp">
              开始实验
            </el-button>
            <el-button type="danger" style="width: 35%;height: 100%;" v-if="!isStart" @click="endExp">
              结束实验
            </el-button>
          </div>
          <div class="bind">
            <span class="putTitle">
              选择绑定Input信号
            </span>
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
                    <div>
                      <el-button @click="addInputRow" :icon="Plus" style="width: 10%; height: 10%;"></el-button>
                      <el-button @click="removeInputRow(rowIndex)" :icon="Minus" :disabled="inputRows.length <= 1" style="width: 10%; height: 20%;"></el-button>
                    </div>
                  </div>
                  
                  <!-- 右侧：链式选择器和对应的加号 -->
                  <div class="chain-part">
                    <!-- 遍历该行的所有链式选择器 -->
                    <div>
                      <span style="font-size: 15px;">
                        引脚：
                      </span>
                    </div>
                    <div style="display: flex; flex-direction: column; width: 38%;">
                      <div
                        v-for="(chain, chainIndex) in row.pins"
                        :key="chainIndex"
                        class="chain-item"
                      >
                        <el-cascader v-model="row.pins[chainIndex]" :show-all-levels="false" clearable :options="inputOptions" style="width: 100%;" placeholder=" " />
                      </div>
                    </div>
                    <!-- 点击加号在当前行新增一个链式选择器 -->
                    <el-button @click="addInputChain(rowIndex)" :icon="Plus" type="primary" style="width: 10%; height: 10%;"></el-button>
                    <el-button @click="removeInputChain(rowIndex)" :icon="Minus" type="primary" :disabled="row.pins.length <= 1" style="width: 10%; height: 10%;"></el-button>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
          <div class="bind">
            <span class="putTitle">
              选择绑定Output信号
            </span>
            <div class="putScroll">
              <el-scrollbar height="100%">
                <div
                  v-for="(row, rowIndex) in outputRows"
                  :key="rowIndex"
                  class="row"
                >
                  <!-- 左侧：input 和对应的加号 -->
                  <div class="put-part" style="width: 35%;">
                    <div>
                      <span>
                        Output:
                      </span>
                      <el-input v-model="row.signal" type="text" style="width: 40%"/>
                    </div>
                    <!-- 点击加号新增一行 -->
                    <div>
                      <el-button @click="addOutputRow" :icon="Plus" type="primary" style="width: 10%; height: 10%;"></el-button>
                      <el-button @click="removeOutputRow(rowIndex)" :icon="Minus" type="primary" :disabled="outputRows.length <= 1" style="width: 10%; height: 20%;"></el-button>
                    </div>
                  </div>
                  
                  <!-- 右侧：链式选择器和对应的加号 -->
                  <div class="chain-part">
                    <!-- 遍历该行的所有链式选择器 -->
                    <div>
                      <span style="font-size: 15px;">
                        引脚：
                      </span>
                    </div>
                    <div style="display: flex; flex-direction: column; width: 38%;">
                      <div
                        v-for="(chain, chainIndex) in row.pins"
                        :key="chainIndex"
                        class="chain-item"
                      >
                        <el-cascader v-model="row.pins[chainIndex]" :show-all-levels="false" :options="outputOptions" style="width: 100%;" placeholder=" " />
                      </div>
                    </div>
                    <!-- 点击加号在当前行新增一个链式选择器 -->
                    <el-button @click="addOutputChain(rowIndex)" :icon="Plus" type="primary" style="width: 10%; height: 10%;"></el-button>
                    <el-button @click="removeOutputChain(rowIndex)" :icon="Minus" type="primary" :disabled="row.pins.length <= 1" style="width: 10%; height: 10%;"></el-button>
                  </div>
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span>
      FPGA 远程实验平台
    </span>
  </div>
</template>

<style lang="scss" scoped>
.backGround{
  background-image: url('../../src/assets/bj.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  .header{
    width: 46%;
    height: 15%;
    margin-top: 1%;
    margin-left: 4%;
  }
  .bdPart{
    width: 92%;
    height: 80%;
    margin: 0 auto;
    display: flex;
    flex-wrap: nowrap;
    .VirDeskPart{
      width: 66%;
      height: 100%;
      >img{
        width: 100%;
        height: 100%;
      }
    }
    .bindingPart{
      width: 34%;
      height: 100%;
      display: flex;
      flex-direction: row-reverse;
      .bindBox{
        width: 90%;
        height: 100%;
        border-radius: 30px;
        background-color: rgba(246, 246, 246, 1);
        box-shadow: 8px 8px 10px rgba(0, 0, 0, 0.3);
        .bindHeader{
          width: 90%;
          height: 7%;
          margin: 0 auto;
          margin-top: 6%;
          display: flex;
          justify-content: space-around;
          .UploadBt{
            width: 35%;
            height: 100%;
          }
        }
        .bind{
          width: 100%;
          height: 40%;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          .putTitle{
            position: absolute;
            top: 5%;
            left: 5%;
            font-size: 18px;
          }
          .putScroll{
            width: 90%;
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
                width: 30%;
                span{
                  font-size: 15px;
                }
                button{
                  margin: 1px;
                }
                .el-button{
                  background-color: rgb(185, 178, 178);
                  color: white;
                }
              }
              .chain-part {
                display: flex;
                align-items: flex-start;
                width: 70%;
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
      }
    }
  }
  

  
  > span{
    position: absolute;
    top: 6%;
    right: 5%;
    font-size: 35px;
    color: white;
  }
}
::v-deep .el-upload {
  width: 100%;
  height: 100%;
}

</style>
