<script setup>
import { ref, watch } from 'vue'
import { VBselecting } from '@/components/board-selecting/VBselecting.vue'

// 用来存储板子选择
const boardselecting = ref('')

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
    <VBselecting v-model="dialogVisible" v-if="boardselecting === 'virtual'" />
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
