<script setup>
// import { ref } from 'vue';

// const metaInfo = ref({
//   title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
//       titleTemplate: title => {
//         return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
//       }
// })
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
