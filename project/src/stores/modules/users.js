import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'FPGA-user',
  () => {
    const token = ref('') // portal token
    const boardToken = ref('') // virtual/real board token
    const userRole = ref('') // 添加用户角色\
    const username = ref('')
    const departmentName = ref('')
    const departmentId = ref(null)

    const setToken = newToken => {
      token.value = newToken //将newToken赋值给token
    }
    const setBoardToken = newToken => {
      boardToken.value = newToken
    }
    const removeToken = () => {
      token.value = ''
      userRole.value = '' // 清除角色信息
      boardToken.value = ''
      username.value = ''
      departmentName.value = ''
      departmentId.value = null
    }

    const setRole = role => {
      userRole.value = role
    }
    const setProfile = profile => {
      if (!profile) return
      if (profile.username !== undefined) username.value = profile.username
      if (profile.departmentName !== undefined)
        departmentName.value = profile.departmentName
      if (profile.departmentId !== undefined) departmentId.value = profile.departmentId
    }

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService() // 请求获取数据
      user.value = res.data.data
    }
    const setUser = obj => {
      user.value = obj
    }

    // 登录历史记录
    const loginHistory = ref([])
    const recordLogin = () => {
      const now = new Date().toLocaleString()
      loginHistory.value.push({ userId: user.value.id, time: now })
    }

    return {
      token,
      boardToken,
      userRole,
      username,
      departmentName,
      departmentId,
      setToken,
      setBoardToken,
      removeToken,
      setRole,
      setProfile,
      user,
      getUser,
      setUser,
      loginHistory,
      recordLogin,
    }
  },
  {
    persist: true,
  },
)
