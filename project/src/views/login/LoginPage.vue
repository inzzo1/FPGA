######LoginPage.vue########
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

const setTrue = true
</script>

<template>
  <el-row class="login-page">
    <el-dialog
      v-model="setTrue"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="dialog-content">
        <div class="left-side">
          <img src="@/assets/pictures/LoginImage.png" />
        </div>
        <div class="right-side">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="登录" name="login"></el-tab-pane>
            <el-tab-pane label="注册" name="register"></el-tab-pane>
          </el-tabs>
          <LoginForm v-if="activeTab === 'login'" />
          <RegisterForm v-else-if="activeTab === 'register'" />
        </div>
      </div>
    </el-dialog>
  </el-row>
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
}

:deep(.el-dialog) {
  width: 90% !important;
  max-width: 800px;
  height: 80vh !important;
  min-height: 500px;
  border-radius: 12px;
}

:deep(.el-dialog__body) {
  padding: 0px !important;
  height: calc(100% - 40px);
}

.dialog-content {
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
