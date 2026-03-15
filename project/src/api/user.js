import axios from 'axios'
import request, { baseURL } from '@/utils/request'

// 获取用户基本信息
export const userGetInfoService = id =>
  request.get('/account/role/get', {
    params: { id },
  })

// 登录接口（AuthController）
export const userLoginService = data => request.post('/auth/login', data)

// 第三方登录接口（SSO）
export const thirdLoginService = data => request.post('/sso/auth/third_login', data)

// 退出登录接口（AuthController）
export const userLogoutService = params =>
  request.get('/auth/logout', { params })

// 生成验证码接口（AuthController）
export const generateVerificationCodeService = data =>
  request.post('/auth/generate-verification-code', data)

// 生成验证码图片（HttpServletResponse 直接返回图片）
export const generateVerificationCodeImageService = data =>
  axios.post(`${baseURL}/auth/generate-verification-code`, data || {}, {
    responseType: 'blob',
  })

// 生成 token（VbTokenController）
export const generateTokenService = () =>
  request.get('/vboard/token/generateToken', { withCredentials: true })

// 校验 token（VbTokenController）
export const checkTokenService = (config = {}) =>
  request.post('/vboard/token/checkToken', {}, { withCredentials: true, ...config })

// 刷新 token（VbTokenController）
export const reloadTokenService = (config = {}) =>
  request.post('/vboard/token/reload', {}, { withCredentials: true, ...config })

// 注册接口（创建用户）
export const userRegisterService = data =>
  request.post('/account/user/create', {
    username: data.username,
    password: data.password,
    userRoleId: getRoleId(data.role), // 需要角色转换逻辑
    userDepartmentId: data.school, // 学校ID
  })

// 获取学校列表
export const getSchoolsService = () =>
  request.get('/account/department/listPage?current=1&size=100')

// 获取学院/部门列表（登录页下拉框）
export const getDepartmentListService = (params = { current: 1, size: 100 }) =>
  request.get('/account/department/listPage', { params })

// 角色映射逻辑（接口文档------妹写？？）
const getRoleId = role => {
  const roles = {
    student: 1, // 模拟ID，需根据实际接口数据调整
    teacher: 2,
    admin: 3,
  }
  return roles[role] || 1
}
