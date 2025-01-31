<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../../components/login/LoginForm.vue'
import RegisterForm from '../../components/login/RegisterForm.vue'

const router = useRouter()

// 当前选中的 tab，登录或注册
const activeTab = ref('login')

// 监听 tab 变化，更新路由
//这里对登录和注册的表单作出两层绑定，一是绑定tab，二是绑定路由
watchEffect(() => {
  router.push(`/${activeTab.value}`)
})

// 根据路由来初始化 tab 的选项
if (router.currentRoute.value.path === '/register') {
  activeTab.value = 'register'
} else {
  activeTab.value = 'login'
}
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12"></el-col>

    <el-col :span="6" :offset="3" class="form">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="登录" name="login"></el-tab-pane>
        <el-tab-pane label="注册" name="register"></el-tab-pane>
      </el-tabs>
      <LoginForm v-if="activeTab === 'login'" />
      <RegisterForm v-else-if="activeTab === 'register'" />
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
%bg {
  // background-color: rgb(220, 236, 236);
  background-image: url('../../src/assets/pictures/背景-blue.jpg');
}

.login-page {
  height: 100vh;
  @extend %bg;
  display: flex;
  align-items: center; // 垂直居中
}
</style>
