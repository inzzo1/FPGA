######RegisterForm.vue########
<script setup>
import { userRegisterService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/users'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const Schooloptions = ref([])
const form = ref()

const userStore = useUserStore()
const router = useRouter()

// // 等后端数据------渲染Schooloptions的学校列表，渲染完成后页面显示
// import { onMounted } from 'vue'
// import { getSchoolsService } from '@/api/user.js'
// onMounted(async () => {
//   const res = await getSchoolsService()
//   Schooloptions.value = res.data.result.object.map(item => ({
//     label: item.name,
//     value: item.id,
//   }))
// })

// 注册表单数据
const registerForm = ref({
  school: '',
  username: '',
  password: '',
  confirmPassword: '',
  captcha: '',
  role: 'student', // 添加角色字段，默认为学生
})

// 整个表单的校验规则
// 1. 非空校验 required: true      message消息提示，  trigger触发校验的时机 blur change
// 2. 长度校验 min:xx, max: xx
// 3. 正则校验 pattern: 正则规则    \S 非空字符
// 4. 自定义校验 => 自己写逻辑校验 (校验函数)
//    validator: (rule, value, callback)
//    (1) rule  当前校验规则相关的信息
//    (2) value 所校验的表单元素目前的表单值
//    (3) callback 无论成功还是失败，都需要 callback 回调
//        - callback() 校验成功
//        - callback(new Error(错误信息)) 校验失败
const rules = {
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
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== registerForm.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur',
    },
  ],
}

// const register = async () => {
//   // 注册成功之前，先进行校验，校验成功 → 请求，校验失败 → 自动提示
//   await form.value.validate()
//   await userRegisterService(registerForm.value)
//   ElMessage.success('注册成功')
// }

// 注册操作
const regButton = async () => {
  await form.value.validate()

  const res = await userRegisterService(registerForm.value)

  if (res.data.code === 0) {
    userStore.setToken(res.data.token) // 保存 token
    userStore.setRole(registerForm.value.role)

    ElMessage.success('注册成功，请选择板子')
    router.push('/Board-selecting')
  } else {
    ElMessage.error(res.data.message || '注册失败，请重试')
  }
}
</script>

<template>
  <!-- 校验相关
       (1) el-form => :model="ruleForm"      绑定的整个form的数据对象 { xxx, xxx, xxx }
       (2) el-form => :rules="rules"         绑定的整个rules规则对象  { xxx, xxx, xxx }
       (3) 表单元素 => v-model="ruleForm.xxx" 给表单元素，绑定form的子属性
       (4) el-form-item => prop配置生效的是哪个校验规则 (和rules中的字段要对应)
  -->
  <el-form
    :model="registerForm"
    :rules="rules"
    ref="form"
    size="large"
    autocomplete="off"
    label-position="top"
    class="form-container"
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

    <el-form-item prop="school" label="学校">
      <el-select
        v-model="registerForm.school"
        placeholder="Select"
        size="large"
        class="full-width"
      >
        <el-option
          v-for="item in Schooloptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item prop="username" label="学工号">
      <el-input
        v-model="registerForm.username"
        :prefix-icon="User"
        placeholder="请输入用户名"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input
        v-model="registerForm.password"
        name="password"
        :prefix-icon="Lock"
        type="password"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item prop="repassword" label="再次输入">
      <el-input
        v-model="registerForm.repassword"
        name="repassword"
        :prefix-icon="Lock"
        type="password"
        placeholder="请输入再次密码"
      ></el-input>
    </el-form-item>
    <el-form-item prop="role" label="角色">
      <el-radio-group v-model="registerForm.role" class="role-group">
        <el-radio label="student">学生</el-radio>
        <el-radio label="teacher">教师</el-radio>
        <el-radio label="guest">游客</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button
        @click="regButton"
        class="submit-button"
        type="primary"
        auto-insert-space
      >
        注册
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
    justify-content: flex-start;
    flex-wrap: wrap;
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
// .form {
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   user-select: none;

//   .button {
//     width: 100%;
//   }
//   .flex {
//     width: 100%;
//     display: flex;
//     justify-content: space-between;
//   }
// }
</style>
