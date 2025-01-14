<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 用来存储板子选择
const boardselecting = ref('')

// 用来控制对话框显示
const dialogVisible = ref(false)

// 用来存储上传的文件    //!!!!!!这里记得把true改成null
const uploadedFile = ref(true)

// 用来存储上传状态
const uploadStatus = ref('')

// 用来存储手动绑定的引脚数据
const pinBinding = ref({
  a: '',
  b: '',
  f: '',
})

// 用来控制手动引脚绑定的勾选框
const manualBinding = ref(false)

// 监听 pinBinding 的变化，更新 manualBinding
watch(
  () => pinBinding.value,
  newPinBinding => {
    // 如果 a、b、f 都有值，设置 manualBinding 为 true
    if (newPinBinding.a && newPinBinding.b && newPinBinding.f) {
      manualBinding.value = true
    } else {
      manualBinding.value = false
    }
  },
  { deep: true }, // 深度监听 pinBinding 对象中的变化
)

// 上传文件时的验证函数----->1、验证上传的文件是否为.v格式
const beforeUpload = file => {
  const isVFile = file.name.endsWith('.v')
  if (!isVFile) {
    ElMessage.error('请上传 .v 格式的 Verilog 源码文件')
    uploadStatus.value = '上传失败'
  } else {
    uploadStatus.value = '上传成功'
    return isVFile
  }
}

// 选择确定后的操作
const handleConfirm = () => {
  if (boardselecting.value === 'virtual') {
    // 如果选择了虚拟板，强制进行引脚绑定
    if (!manualBinding.value) {
      ElMessage.error('请手动完成引脚绑定')
      return
    }
  }
  if (!uploadedFile.value) {
    ElMessage.error('请上传 .v 格式的 Verilog 文件')
    return
  }

  // 假设这是发送给后端的接口，后端会接收文件和引脚绑定数据
  const postData = {
    file: uploadedFile.value,
    pinBinding: manualBinding.value ? pinBinding.value : {}, // 只有在勾选手动绑定时传递
  }
  console.log(postData)
  // TODO: 通过 axios 或其他方式将数据发送给后端
  dialogVisible.value = false
}

// 点击取消时关闭对话框
const handleCancel = () => {
  dialogVisible.value = false
}
</script>

<template>
  <div class="page-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="logo">
        <img
          src="@/assets/pictures/杭州电子科技大学logo2.png"
          alt="Logo"
          class="logo-img"
        />
      </div>
      <el-menu mode="horizontal" class="menu">
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">实验</el-menu-item>
        <el-menu-item index="3">团队</el-menu-item>
        <el-menu-item index="4">数据</el-menu-item>
      </el-menu>
      <div class="user-info">
        欢迎您, <span class="username">testStudent</span>
      </div>
    </el-header>

    <!-- 内容区 -->
    <h1>请选择您的实验板</h1>
    <el-radio-group class="boardselecting-content" v-model="boardselecting">
      <!-- 虚拟板 -->
      <el-radio-button class="board" :label="'virtual'">
        <h2>虚拟板</h2>
        <img
          src="@/assets/pictures/虚拟板-样例图.png"
          alt="虚拟板"
          class="board-img"
        />
      </el-radio-button>

      <!-- 实物板 -->
      <el-radio-button class="board" :label="'real'">
        <h2>实物板</h2>
        <img
          src="@/assets/pictures/实物板-样例图.png"
          alt="实物板"
          class="board-img"
        />
      </el-radio-button>
    </el-radio-group>

    <div>
      <el-button class="button" type="warning" @click="dialogVisible = true">
        确 定
      </el-button>
    </div>

    <!-- 虚拟板------弹出Dialog完成verilog上传和引脚绑定-->
    <el-dialog
      title="上传verilog源码并绑定引脚"
      v-model="dialogVisible"
      @close="handleCancel"
      width="40%"
    >
      <div v-if="boardselecting === 'virtual'">
        <div>
          <h3>引脚绑定</h3>
          <!-- 引脚绑定部分 -->
          <div>
            <h3>信号 a</h3>
            <el-radio-group v-model="pinBinding.a">
              <el-radio-button label="SW0">SW0</el-radio-button>
              <el-radio-button label="SW1">SW1</el-radio-button>
              <el-radio-button label="SW2">SW2</el-radio-button>
              <el-radio-button label="SW3">SW3</el-radio-button>
              <el-radio-button label="SW4">SW4</el-radio-button>
              <el-radio-button label="SW5">SW5</el-radio-button>
              <el-radio-button label="SW6">SW6</el-radio-button>
              <el-radio-button label="SW7">SW7</el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <h3>信号 b</h3>
            <el-radio-group v-model="pinBinding.b">
              <el-radio-button label="SW0">SW0</el-radio-button>
              <el-radio-button label="SW1">SW1</el-radio-button>
              <el-radio-button label="SW2">SW2</el-radio-button>
              <el-radio-button label="SW3">SW3</el-radio-button>
              <el-radio-button label="SW4">SW4</el-radio-button>
              <el-radio-button label="SW5">SW5</el-radio-button>
              <el-radio-button label="SW6">SW6</el-radio-button>
              <el-radio-button label="SW7">SW7</el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <h3>信号 f</h3>
            <el-radio-group v-model="pinBinding.f">
              <el-radio-button label="LD0">LD0</el-radio-button>
              <el-radio-button label="LD1">LD1</el-radio-button>
              <el-radio-button label="LD2">LD2</el-radio-button>
              <el-radio-button label="LD3">LD3</el-radio-button>
              <el-radio-button label="LD4">LD4</el-radio-button>
              <el-radio-button label="LD5">LD5</el-radio-button>
              <el-radio-button label="LD6">LD6</el-radio-button>
              <el-radio-button label="LD7">LD7</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>

      <el-upload
        class="upload-demo"
        drag
        action=""
        :before-upload="beforeUpload"
        :on-success="
          (res, file) => {
            uploadedFile.value = file
          }
        "
        accept=".v"
        v-if="boardselecting === 'virtual'"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          <span>{{
            uploadStatus === ''
              ? '将 .v 格式文件拖到此处，或者点击上传'
              : uploadStatus
          }}</span>
        </div>
      </el-upload>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.page-container {
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px 20px;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-img {
  width: 200px;
  margin-right: 10px;
}

.menu {
  flex-grow: 1;
  margin-left: 20px;
}

.user-info {
  font-size: 16px;
}

.boardselecting-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 60px 0;
}

.board {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 10px;
  width: 45%;
  box-shadow: 0 2px 5px rgba(23, 17, 17, 0.1);
}

.board-img {
  width: 90%;
  margin: 10px 0;
}

.page-container .el-button {
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 50px;
  font-size: 20px;
  border-radius: 30px;
}

.el-dialog {
  border-radius: 12px;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.el-dialog__header {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.el-dialog__body {
  padding: 20px 30px;
}

.dialog-footer .el-button:hover {
  transform: translateY(-2px);
}

.el-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.el-radio-button {
  font-size: 80%;
  border-radius: 6px;
  color: #34495e;
  transition: all 0.3s ease;
  flex: 1 1 20%;
}

.el-radio-button:hover {
  transform: translateY(-2px);
}

.el-upload {
  margin-top: 20px;
  border-radius: 10px;
  text-align: center;
  background-color: #fcfcfc;
  transition: all 0.3s ease;
}

.el-upload__text {
  font-size: 16px;
  color: #34495e;
  margin-top: 10px;
}

h3 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 10px;
  text-align: left;
}

.dialog-footer {
  display: flex;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
    align-items: flex-start;
  }

  .board {
    width: 80%;
    margin-bottom: 20px;
  }
}
</style>
