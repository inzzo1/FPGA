<template>
  <el-container>
    <el-header class="header">
      <div class="logo">
        <img src="@/assets/pictures/杭州电子科技大学logo2.png" width="20%" />
      </div>
      <nav class="nav">
        <el-button type="text">首页</el-button>
        <el-button type="text">实验</el-button>
        <el-button type="text">团队</el-button>
        <el-button type="text">数据</el-button>
        <el-button type="text" class="welcome">欢迎您 testStudent</el-button>
      </nav>
    </el-header>
    <el-main>
      <slot></slot>
    </el-main>
  </el-container>
</template>

<script setup>
import { ElContainer, ElHeader, ElMain, ElButton } from 'element-plus'
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #003366;
  color: white;
}

.logo {
  font-size: 1.2em;
}

.nav {
  display: flex;
}

.nav .el-button {
  color: white;
}
</style>
