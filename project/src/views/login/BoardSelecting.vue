<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// const uploadFile = boardType => {
//   ElMessage.info(`正在上传到 ${boardType === 'virtual' ? '虚拟板' : '实物板'}`)
// }

const boardselecting = ref('')
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
      <el-button class="button" type="warning" @click="uploadFile('real')"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<style scoped>
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
  justify-content: space-between; /* 确保两者均匀分布 */
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

@media (max-width: 768px) {
  .content {
    flex-direction: column; /* 小屏幕下，换成纵向排列 */
    align-items: flex-start;
  }

  .board {
    width: 80%; /* 在小屏幕下，让每个板的宽度更大 */
    margin-bottom: 20px; /* 给每个板之间增加间距 */
  }
}
</style>
