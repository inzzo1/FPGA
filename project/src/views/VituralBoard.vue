<script setup lang="ts">
import VitualDesk from '@/components/virtualDesk/index.vue';
import stateHeader from '@/components/header/stateHeader.vue';
import options from '@/stores/options.json'
import { UploadUserFile, ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';
import {simulate} from '@/api/boardApi'

interface Row {
  input: string;
  chains: string[];
}

const uploadDisabled = ref(false);

const inputRows = ref<Row[]>([
  {
    input: '',
    chains: ['']
  }
]);

const outputRows = ref<Row[]>([
  {
    input: '',
    chains: ['']
  }
]);

const inputOptions = options.inputOptions;
const outputOptions = options.outputOptions;

const addInputRow = () => {
  inputRows.value.push({
    input: '',
    chains: ['']
  });
};

const removeInputRow = (rowIndex: number) => {
  inputRows.value.splice(rowIndex, 1); // 使用 splice 删除指定索引的行
};

const addInputChain = (rowIndex: number) => {
  inputRows.value[rowIndex].chains.push('');
};

const removeInputChain = (rowIndex: number) => {
  inputRows.value[rowIndex].chains.pop();
};

const addOutputRow = () => {
  outputRows.value.push({
    input: '',
    chains: ['']
  });
};

const removeOutputRow = (rowIndex: number) => {
  outputRows.value.splice(rowIndex, 1); // 使用 splice 删除指定索引的行
};

const addOutputChain = (rowIndex: number) => {
  outputRows.value[rowIndex].chains.push('');
  console.log('output', outputRows.value)
  console.log('input', inputRows.value)
  console.log('file', fileList.value)
};

const removeOutputChain = (rowIndex: number) => {
  outputRows.value[rowIndex].chains.pop();
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
    inputRows: inputRows.value,
    outputRows: outputRows.value
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
  
  simulate(formData)
  isStart.value = !isStart.value
}

const endExp = () => {
  isStart.value = !isStart.value
}


</script>

<template>
  <div style="width: 100%; height: 100%" class="backGround">
    <div class="header">
      <stateHeader></stateHeader>
    </div>
    <div class="bdPart">
      <div class="VirDeskPart">
        <VitualDesk> </VitualDesk>
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
                      <el-input v-model="row.input" type="text" style="width: 50%"/>
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
                        v-for="(chain, chainIndex) in row.chains"
                        :key="chainIndex"
                        class="chain-item"
                      >
                        <el-cascader v-model="row.chains[chainIndex]" :show-all-levels="false" clearable :options="inputOptions" style="width: 100%;" placeholder=" " />
                      </div>
                    </div>
                    <!-- 点击加号在当前行新增一个链式选择器 -->
                    <el-button @click="addInputChain(rowIndex)" :icon="Plus" type="primary" style="width: 10%; height: 10%;"></el-button>
                    <el-button @click="removeInputChain(rowIndex)" :icon="Minus" type="primary" :disabled="row.chains.length <= 1" style="width: 10%; height: 10%;"></el-button>
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
                      <el-input v-model="row.input" type="text" style="width: 40%"/>
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
                        v-for="(chain, chainIndex) in row.chains"
                        :key="chainIndex"
                        class="chain-item"
                      >
                        <el-cascader v-model="row.chains[chainIndex]" :show-all-levels="false" :options="outputOptions" style="width: 100%;" placeholder=" " />
                      </div>
                    </div>
                    <!-- 点击加号在当前行新增一个链式选择器 -->
                    <el-button @click="addOutputChain(rowIndex)" :icon="Plus" type="primary" style="width: 10%; height: 10%;"></el-button>
                    <el-button @click="removeOutputChain(rowIndex)" :icon="Minus" type="primary" :disabled="row.chains.length <= 1" style="width: 10%; height: 10%;"></el-button>
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
  background-image: url('../assets/bg-dyn-light.png');
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
      width: 72%;
      height: 100%;
    }
    .bindingPart{
      width: 28%;
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
