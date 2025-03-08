<script setup lang="ts">
import VitualDesk from '@/components/virtualDesk/index.vue';
import stateHeader from '@/components/header/stateHeader.vue';
import { UploadUserFile } from 'element-plus';
import { ref } from 'vue';
import { Plus, Minus } from '@element-plus/icons-vue';

interface Row {
  input: string;
  chains: string[];
}

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

const inputOptions = [
  {
    label: 'SW',
    children: [
      {
        value: 'SW00',
        label: 'SW00'
      },
      {
        value: 'SW01',
        label: 'SW01'
      },
      {
        value: 'SW02',
        label: 'SW02'
      },
      {
        value: 'SW03',
        label: 'SW03'
      },
      {
        value: 'SW04',
        label: 'SW04'
      },
      {
        value: 'SW05',
        label: 'SW05'
      },
      {
        value: 'SW06',
        label: 'SW06'
      },
      {
        value: 'SW07',
        label: 'SW07'
      },
      {
        value: 'SW08',
        label: 'SW08'
      },
      {
        value: 'SW09',
        label: 'SW09'
      },
      {
        value: 'SW10',
        label: 'SW10'
      },
      {
        value: 'SW11',
        label: 'SW11'
      },
      {
        value: 'SW12',
        label: 'SW12'
      },
      {
        value: 'SW13',
        label: 'SW13'
      },
      {
        value: 'SW14',
        label: 'SW14'
      },
      {
        value: 'SW15',
        label: 'SW15'
      },
      {
        value: 'SW16',
        label: 'SW16'
      },
      {
        value: 'SW17',
        label: 'SW17'
      },
      {
        value: 'SW18',
        label: 'SW18'
      },
      {
        value: 'SW19',
        label: 'SW19'
      }
    ]
  },
  {
    label: 'SWB',
    children:[
      {
        value: 'SWB00',
        label: 'SWB00'
      },
      {
        value: 'SWB01',
        label: 'SWB01'
      },
      {
        value: 'SWB02',
        label: 'SWB02'
      },
      {
        value: 'SWB03',
        label: 'SWB03'
      },
      {
        value: 'SWB04',
        label: 'SWB04'
      },
      {
        value: 'SWB05',
        label: 'SWB05'
      },
      {
        value: 'SWB06',
        label: 'SWB06'
      },
      {
        value: 'SWB07',
        label: 'SWB07'
      },
      {
        value: 'SWB08',
        label: 'SWB08'
      },
      {
        value: 'SWB09',
        label: 'SWB09'
      }
    ]
  },
  {
    label: 'Input',
    children: [
      {
        value: 'Input0',
        label: 'Input0'
      },
      {
        value: 'Input1',
        label: 'Input1'
      },
      {
        value: 'Input2',
        label: 'Input2'
      },
      {
        value: 'Input3',
        label: 'Input3'
      }
    ]
  }
]

const outputOptions = [
  {
    label: 'LED',
    children: [
      {
        value: 'L00',
        label: 'L00'
      },
      {
        value: 'L01',
        label: 'L01'
      },
      {
        value: 'L02',
        label: 'L02'
      },
      {
        value: 'L03',
        label: 'L03'
      },
      {
        value: 'L04',
        label: 'L04'
      },
      {
        value: 'L05',
        label: 'L05'
      },
      {
        value: 'L06',
        label: 'L06'
      },
      {
        value: 'L07',
        label: 'L07'
      },
      {
        value: 'L08',
        label: 'L08'
      },
      {
        value: 'L09',
        label: 'L09'
      },
      {
        value: 'L10',
        label: 'L10'
      },
      {
        value: 'L11',
        label: 'L11'
      },
      {
        value: 'L12',
        label: 'L12'
      },
      {
        value: 'L13',
        label: 'L13'
      },
      {
        value: 'L14',
        label: 'L14'
      },
      {
        value: 'L15',
        label: 'L15'
      },
      {
        value: 'L16',
        label: 'L16'
      },
      {
        value: 'L17',
        label: 'L17'
      },
      {
        value: 'L18',
        label: 'L18'
      },
      {
        value: 'L19',
        label: 'L19'
      }
    ]
  },
  {
    label: 'Output',
    children: [
      {
        value: 'Output0',
        label: 'Output0'
      },
      {
        value: 'Output1',
        label: 'Output1'
      },
      {
        value: 'Output2',
        label: 'Output2'
      },
      {
        value: 'Output3',
        label: 'Output3'
      },
      {
        value: 'Output4',
        label: 'Output4'
      },
      {
        value: 'Output5',
        label: 'Output5'
      }
    ]
  }
]

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
  console.log('File selected:', file);  // 可选，查看选中的文件
  return false;  // 返回 false，防止自动上传
};

const isStart = ref(true)

const startExp = () => {
  isStart.value = !isStart.value
  const bindData = {
    inputRows: inputRows.value,
    outputRows: outputRows.value
  };
  const formData = new FormData();
  const bindBlob = new Blob([JSON.stringify(bindData)], { type: 'application/json' });
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
            v-model:file-list="fileList"
            multiple
            :before-upload="beforeUpload"
            class="UploadBt"
            >
              <el-button type="primary" style="width: 100%;height: 100%;">上传.V</el-button>
            </el-upload>
            <el-button type="success" style="width: 35%;height: 100%;" v-if="isStart" @click="startExp">
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
                      <el-button @click="addInputRow" :icon="Plus" type="primary" style="width: 10%; height: 10%;"></el-button>
                      <el-button @click="removeInputRow(rowIndex)" :icon="Minus" type="primary" :disabled="inputRows.length <= 1" style="width: 10%; height: 20%;"></el-button>
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
        background-color: #f6f6f6;
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
