######LoginPage.vue########
<script setup>
import { ref, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/users'
import { thirdLoginService } from '@/api/user'
import LoginForm from '../../components/login/LoginForm.vue'
import RegisterForm from '../../components/login/RegisterForm.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 当前选中的 tab，登录或注册
const activeTab = ref('login')
const thirdLoginLoading = ref(false)

const resolveAuthToken = resp =>
  resp?.data?.result?.tokenValue ||
  resp?.data?.result?.token ||
  resp?.data?.token

const persistAuthCookie = (tokenName, tokenValue, tokenTimeout) => {
  if (!tokenName || !tokenValue) return
  const timeout = Number(tokenTimeout)
  const maxAgePart = Number.isFinite(timeout) && timeout > 0 ? `; Max-Age=${timeout}` : ''
  document.cookie = `${tokenName}=${encodeURIComponent(tokenValue)}; Path=/${maxAgePart}`
}

const handleThirdLogin = async jwtToken => {
  thirdLoginLoading.value = true
  try {
    const resp = await thirdLoginService({ jwtToken })
    const authToken = resolveAuthToken(resp)
    const tokenName = resp?.data?.result?.tokenName || 'satoken'
    const tokenTimeout = resp?.data?.result?.tokenTimeout
    if (!authToken || typeof authToken !== 'string') {
      throw new Error('第三方登录 token 获取失败')
    }

    userStore.setToken(authToken)
    persistAuthCookie(tokenName, authToken, tokenTimeout)
    userStore.setRole('guest')
    if (resp?.data?.result?.loginId) {
      userStore.setProfile({ username: resp.data.result.loginId })
    }
    userStore.recordLogin()

    ElMessage.success('第三方登录成功')
    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/Board-selecting'
    router.replace(redirect)
  } catch (err) {
    ElMessage.error(err?.response?.data?.msg || err?.msg || err?.message || '第三方登录失败')
  } finally {
    thirdLoginLoading.value = false
  }
}

// 监听 tab 变化，更新路由
//这里对登录和注册的表单作出两层绑定，一是绑定tab，二是绑定路由
watchEffect(() => {
  const targetPath = `/${activeTab.value}`
  if (route.path !== targetPath) {
    router.replace({ path: targetPath, query: route.query })
  }
})

// 根据路由来初始化 tab 的选项
if (route.path === '/register') {
  activeTab.value = 'register'
} else {
  activeTab.value = 'login'
}

onMounted(() => {
  const jwtToken =
    typeof route.query.jwtToken === 'string' ? route.query.jwtToken.trim() : ''
  if (!jwtToken) return
  activeTab.value = 'login'
  handleThirdLogin(jwtToken)
})

</script>

<template>
  <div class="login-page">
    <div class="dialog-content">
      <div class="left-side">
        <img src="@/assets/pictures/LoginImage.png" />
      </div>
      <div class="right-side">
        <div v-if="thirdLoginLoading" class="third-login-loading">
          正在进行第三方登录，请稍候...
        </div>
        <template v-else>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="登录" name="login"></el-tab-pane>
            <el-tab-pane label="注册" name="register"></el-tab-pane>
          </el-tabs>
          <LoginForm v-if="activeTab === 'login'" />
          <RegisterForm v-else-if="activeTab === 'register'" />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
%bg {
  background-image: url('../../src/assets/bj.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
:deep() {
  --el-color-primary: #924141 !important;
}

.login-page {
  height: 100vh;
  @extend %bg;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}

.dialog-content {
  width: 90% !important;
  max-width: 800px;
  height: 80vh !important;
  min-height: 500px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  height: 100%;
  display: flex;
  gap: 20px;

  .left-side {
    flex: 1;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  }

  .right-side {
    flex: 1;
    padding: 0 px;
    overflow-y: auto;

    .third-login-loading {
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 16px;
    }

    .el-tabs {
      display: flex;
      flex-direction: column;
      align-items: center;

      .el-tabs__nav-wrap {
        display: flex;
        justify-content: center;
        width: 100%;
      }
    }
  }

  :deep(.el-tabs) {
    .el-tabs__header {
      border-bottom: none !important;
    }

    .el-tabs__item.is-active {
      font-weight: 600; // 加粗
    }

    .el-tabs__item {
      font-size: 18px !important;
      color: #666;
      padding: 0 25px !important;
      transition: all 0.3s;

      &:hover {
        color: #c66a6a !important;
      }
    }

    .el-tabs__active-bar {
      height: 3px !important;
      border-radius: 2px;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 10px !important;

    @media (max-width: 768px) {
      margin-bottom: 12px !important;
    }
  }

  .el-button {
    margin-top: 25px !important;
  }
}
</style>
