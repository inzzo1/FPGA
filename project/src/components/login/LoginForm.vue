<script setup>
import { userLoginService } from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/modules/users'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const form = ref()
const Schooloptions = ref([])

const userStore = useUserStore()
const router = useRouter()

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
  school: '',
  username: '',
  password: '',
  captcha: '',
  role: 'guest',
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

//登录操作
const login = async () => {
  await form.value.validate()
  // //用testID跳转
  // if (
  //   formModel.value.username === 'testStudent' &&
  //   formModel.value.password === 'testStudent1234'
  // ) {
  //   userStore.setToken('mockToken')
  //   userStore.setRole(formModel.value.role)
  //   ElMessage.success('登录成功')
  //   router.push('/Board-selecting')
  //   return
  // }

  //正经跳转
  const res = await userLoginService(formModel.value)
  if (res.data.code === 0) {
    userStore.setToken(res.data.token) // 保存 token
    userStore.setRole(formModel.value.role)
    userStore.recordLogin() // 记录登录时间

    ElMessage.success('登录成功')
    router.push('/Board-selecting')
  } else {
    ElMessage.error(res.data.message || '登录失败，请重试')
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

    <el-form-item prop="school" label="学校">
      <el-select
        v-model="formModel.school"
        placeholder="请选择学校"
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
    <el-form-item prop="role" label="角色">
      <el-radio-group v-model="formModel.role">
        <el-radio label="student">学生</el-radio>
        <el-radio label="teacher">教师</el-radio>
        <el-radio label="guest">游客</el-radio>
        <el-radio label="admin">管理员</el-radio>
      </el-radio-group>
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
