import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'FPGA-user',
  () => {
    const token = ref('')
    const userRole = ref('') // 添加用户角色\

    const setToken = newToken => {
      token.value = newToken //将newToken赋值给token
    }
    const removeToken = () => {
      token.value = ''
      userRole.value = '' // 清除角色信息
    }

    const setRole = role => {
      userRole.value = role
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
      userRole,
      setToken,
      removeToken,
      setRole,
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
