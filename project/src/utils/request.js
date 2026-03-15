import axios from 'axios'
import { useUserStore } from '@/stores/modules/users'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://vfpga.hdu.edu.cn'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000,
  withCredentials: true,
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    const url = config.url || ''
    const isBoardApi = url.startsWith('/vboard') || url.startsWith('/fpga')
    const isBoardTokenCheck =
      url.startsWith('/vboard/token/checkToken') ||
      url.startsWith('/vboard/token/reload') ||
      url.startsWith('/fpga/token/checkToken') ||
      url.startsWith('/fpga/token/reload')
    const isBoardTokenGenerate =
      url.startsWith('/vboard/token/generateToken') ||
      url.startsWith('/fpga/token/generateToken')

    if (isBoardTokenGenerate) {
      if (useStore.token) {
        // 兼容后端按 satoken 或 token 头读取登录态
        config.headers.satoken = useStore.token
        config.headers.token = useStore.token
      }
      return config
    }

    if (isBoardApi || isBoardTokenCheck) {
      // 板卡相关接口只使用实验 token，避免把 satoken 误当板卡 token 传给后端
      if (useStore.boardToken) config.headers.token = useStore.boardToken
      return config
    }

    if (useStore.token) {
      config.headers.satoken = useStore.token
      config.headers.token = useStore.token
    }
    return config
  },
  err => Promise.reject(err),
)

// 响应拦截器
instance.interceptors.response.use(
  res => {
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) {
      return res
    }
    // TODO 3. 处理业务失败
    // 处理业务失败, 给错误提示，抛出错误
    ElMessage.error(res.data.message || res.data.msg || '服务异常')
    return Promise.reject(res.data)
  },
  err => {
    // TODO 5. 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) {
      router.push('/login')
    }

    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response?.data?.message || err.response?.data?.msg || '服务异常')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
