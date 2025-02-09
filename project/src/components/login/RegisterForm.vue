<script setup>
import { userRegisterService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const form = ref()

const userStore = useUserStore()
const router = useRouter()

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

//纯前端版本
const regButton = async () => {
  await form.value.validate()
  if (
    registerForm.value.username === 'testStudent' &&
    registerForm.value.password === 'testStudent1234'
  ) {
    userStore.setToken('mockToken')
    userStore.setRole(registerForm.value.role) // 设置用户角色
    ElMessage.success('注册成功，请选择板子')
    router.push('/Board-selecting')
    return
  }
  const res = await userRegisterService(registerForm.value)
  userStore.setToken(res.data.token)
  userStore.setRole(registerForm.value.role) // 设置用户角色
  ElMessage.success('注册成功，请选择板子')
  router.push('/Board-selecting')
}

//等后端来了换成这一段
// const login = async () => {
//   await form.value.validate()
//   const res = await userLoginService(formModel.value)
//   userStore.setToken(res.data.token)
//   ElMessage.success('注册成功')
//   router.push('/Board-selecting')
// }
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
    label-width="auto"
    style="max-width: 600px"
  >
    <el-form-item>
      <div>
        <img src="@/assets/pictures/杭州电子科技大学logo2.png" width="100%" />
      </div>
    </el-form-item>

    <el-form-item prop="schlool" label="学校">
      <el-select
        v-model="value"
        placeholder="Select"
        size="large"
        style="width: 240px"
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
      <el-radio-group v-model="registerForm.role">
        <el-radio label="student">学生</el-radio>
        <el-radio label="teacher">教师</el-radio>
        <el-radio label="guest">游客</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button
        @click="regButton"
        class="button"
        type="primary"
        auto-insert-space
      >
        注册
      </el-button>
    </el-form-item>
  </el-form>
</template>

<style lang="scss" scoped>
%bg {
  background-color: rgb(220, 236, 236);
  background-image: url('@/src/assets/pictures/背景-light.png');
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;

  .button {
    width: 100%;
  }
  .flex {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
