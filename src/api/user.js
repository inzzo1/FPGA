import request from '@/utils/request'

// 创建角色
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/role/create', { username, password, repassword })

// 登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/auth/login', { username, password })

// 登出接口
export const userLogoutService = data => request.get('/auth/logout', data)

// 获取用户基本信息
export const userGetInfoService = id =>
  request.get('/account/role/get', {
    params: { id },
  })

// // 登录接口（接口文档----妹写？？）
// export const userLoginService = data => {
//   return request.post('/account/user/login', data)
// }

// 获取学校列表
export const getSchoolsService = () => {
  return request.get('/account/department/listPage?current=1&size=100')
}
