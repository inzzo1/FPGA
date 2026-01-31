######LoginForm.vue########
<script setup>
import { userLoginService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/users'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const form = ref()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

// // 等后端数据------渲染Schooloptions的学校列表，渲染完成后页面显示--暂时会显示服务异常
// import { onMounted } from 'vue'
// import { getSchoolsService } from '@/api/user.js'
// onMounted(async () => {
//   const res = await getSchoolsService()
//   Schooloptions.value = res.data.result.object.map(item => ({
//     label: item.name,
//     value: item.id,
//   }))
// })

const formModel = ref({
  departmentName: '',
  username: '',
  password: '',
  captcha: '',
  role: 'guest',
})
const rules = {
  departmentName: [
    { required: true, message: '请输入学院/部门名称', trigger: 'blur' },
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名必须是 2-20位 的字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur',
    },
  ],
}

//登录操作
const login = async () => {
  await form.value.validate()

  try {
    const loginResp = await userLoginService({
      username: formModel.value.username,
      password: formModel.value.password,
    })
    const authToken =
      loginResp.data?.msg ||
      loginResp.data?.result?.token ||
      loginResp.data?.result?.tokenString ||
      loginResp.data?.token

    if (!authToken || typeof authToken !== 'string') {
      throw new Error('登录 token 获取失败')
    }

    userStore.setToken(authToken)
    userStore.setRole(formModel.value.role)
    userStore.setProfile({
      username: formModel.value.username,
      departmentName: formModel.value.departmentName,
    })
    userStore.recordLogin()

    ElMessage.success('登录成功')
    const redirect =
      typeof route.query.redirect === 'string'
        ? route.query.redirect
        : '/Board-selecting'
    router.push(redirect)
  } catch (err) {
    ElMessage.error(err?.message || '登录失败，请重试')
  }
}
</script>
<template>
  <el-form
    class="form-container"
    :model="formModel"
    :rules="rules"
    ref="form"
    size="large"
    autocomplete="off"
    label-position="top"
  >
    <el-form-item>
      <!-- <div class="logo-container">
        <img
          src="@/assets/pictures/杭州电子科技大学logo2.png"
          alt="学校logo"
          class="logo"
        />
      </div> -->
    </el-form-item>

    <el-form-item prop="departmentName" label="学院/部门">
      <el-input
        v-model="formModel.departmentName"
        placeholder="请输入学院/部门名称"
      ></el-input>
    </el-form-item>

    <el-form-item prop="username" label="学工号">
      <el-input
        v-model="formModel.username"
        :prefix-icon="User"
        placeholder="请输入用户名"
      ></el-input>
    </el-form-item>

    <el-form-item prop="password" label="密码">
      <el-input
        v-model="formModel.password"
        :prefix-icon="Lock"
        type="password"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>

    <el-form-item prop="role" label="角色">
      <el-radio-group v-model="formModel.role" class="role-group">
        <el-radio label="student">学生</el-radio>
        <el-radio label="teacher">教师</el-radio>
        <el-radio label="guest">游客</el-radio>
        <el-radio label="admin">管理员</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item class="remember-forgot">
      <div class="flex-between">
        <el-checkbox>记住我</el-checkbox>
        <el-link type="primary" :underline="false">忘记密码？</el-link>
      </div>
    </el-form-item>

    <el-form-item class="submit-item">
      <el-button
        @click="login"
        class="submit-button"
        type="primary"
        auto-insert-space
      >
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: white;

  .logo-container {
    text-align: center;
    .logo {
      width: 100%;
      height: auto;
    }
  }

  .full-width {
    width: 100%;
  }

  .role-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .remember-forgot {
    margin-bottom: 12px;
    .flex-between {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .submit-item {
    margin-top: 24px;
    :deep(.el-form-item__content) {
      justify-content: center;
    }
  }

  .submit-button {
    width: 100%;
    height: 48px;
    font-size: 16px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  @media (max-width: 480px) {
    padding: 15px;
    box-shadow: none;

    .role-group {
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
