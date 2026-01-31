<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/modules/users'

const userStore = useUserStore()
const displayName = computed(() => userStore.username || '未登录')
</script>

<template>
  <div id="app">
    <el-header class="header">
      <div class="logo">
        <img
          src="@/assets/pictures/SchoolLogo.png"
          alt="Logo"
          class="logo-img"
        />
      </div>
      <el-menu mode="horizontal" class="menu" router  :default-active="$route.path">
        <el-menu-item index="/VirtualBoard">首页</el-menu-item>
        <el-menu-item index="/teacher-dashboard">实验概览</el-menu-item>
        <el-menu-item index="3">团队</el-menu-item>
        <el-menu-item index="4">数据</el-menu-item>
      </el-menu>
      <div class="user-info">
        欢迎您, <span class="username">{{ displayName }}</span>
      </div>
    </el-header>
    <router-view style="height: 93%;"/>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  height: 7%;
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
</style>
