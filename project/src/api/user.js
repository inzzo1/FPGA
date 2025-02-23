import request from '@/utils/request'

// // 注册接口
// export const userRegisterService = ({ username, password, repassword }) =>
//   request.post('/account/user/create', { username, password, repassword })

// // 登录接口
// export const userLoginService = ({ username, password }) =>
//   request.post('/fpga/token/generateToken', { username, password })

// 获取用户基本信息
export const userGetInfoService = id =>
  request.get('/account/role/get', {
    params: { id },
  })

// 登录接口（接口文档----妹写？？）
export const userLoginService = data => {
  return request.post('/account/user/login', data)
}

// 注册接口（接口文档-------创建用户）
export const userRegisterService = data => {
  return request.post('/account/user/create', {
    username: data.username,
    password: data.password,
    userRoleId: getRoleId(data.role), // 需要角色转换逻辑
    userDepartmentId: data.school, // 学校ID
  })
}

// 获取学校列表
export const getSchoolsService = () => {
  return request.get('/account/department/listPage?current=1&size=100')
}

// 角色映射逻辑（接口文档------妹写？？）
const getRoleId = role => {
  const roles = {
    student: 1, // 模拟ID，需根据实际接口数据调整
    teacher: 2,
    admin: 3,
  }
  return roles[role] || 1
}
