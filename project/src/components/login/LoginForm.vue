<script setup>
import { userLoginService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const form = ref()

const userStore = useUserStore()
const router = useRouter()

const formModel = ref({
  school: '',
  username: '',
  password: '',
  captcha: '',
})
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
}

//纯前端版本
const login = async () => {
  await form.value.validate()
  //用testID跳转
  if (
    formModel.value.username === 'testStudent' &&
    formModel.value.password === 'testStudent1234'
  ) {
    userStore.setToken('mockToken') /////改！！！！！！！！！！！！！！！
    ElMessage.success('登录成功')
    router.push('/Board-selecting')
    return
  }
  //正经跳转
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功')
  router.push('/')
}

//等后端来了换成这一段
// const login = async () => {
//   await form.value.validate()
//   const res = await userLoginService(formModel.value)
//   userStore.setToken(res.data.token)
//   ElMessage.success('登录成功')
//   router.push('/')
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
    :model="formModel"
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
        v-model="formModel.username"
        :prefix-icon="User"
        placeholder="请输入用户名"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码">
      <el-input
        v-model="formModel.password"
        name="password"
        :prefix-icon="Lock"
        type="password"
        placeholder="请输入密码"
      ></el-input>
    </el-form-item>
    <el-form-item class="flex">
      <div class="flex">
        <el-checkbox>记住我</el-checkbox>
        <el-link type="primary" :underline="false">忘记密码？</el-link>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button @click="login" class="button" type="primary" auto-insert-space>
        登录</el-button
      >
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
