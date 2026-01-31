import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/modules/users'

// createRouter 创建路由实例
// 配置 history 模式
// 1. history模式：createWebHistory     地址栏不带 #
// 2. hash模式：   createWebHashHistory 地址栏带 #
// console.log(import.meta.env.DEV)

// vite 中的环境变量 import.meta.env.BASE_URL  就是 vite.config.js 中的 base 配置项

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/VirtualBoard' },
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    {
      path: '/register',
      component: () => import('@/views/login/LoginPage.vue'),
    },
    {
      path: '/Board-selecting',
      component: () => import('@/views/login/BoardSelecting.vue'),
    },
    {
      path: '/VirtualBoard',
      component: () => import('@/views/VirtualBoard.vue'),
    },
    {
      path: '/Board-selectingnew',
      component: () => import('@/views/login/BoardSelectingnew.vue'),
    },
    {
      path: '/RealBoard',
      component: () => import('@/views/RealBoard.vue'),
    },
    {
      path: '/teacher-dashboard',
      component: () => import('@/views/TeacherDashboard.vue'),
      meta: { requiresAuth: true, role: 'teacher' },
    },
  ],
})

// 登录访问拦截 => 默认是直接放行的
// 根据返回值决定，是放行还是拦截
// 返回值：
// 1. undefined / true  直接放行
// 2. false 拦回from的地址页面
// 3. 具体路径 或 路径对象  拦截到对应的地址
//    '/login'   { name: 'login' }

router.beforeEach(async to => {
  const useStore = useUserStore()
  const publicPaths = ['/login', '/register', '/VirtualBoard']
  if (publicPaths.includes(to.path)) return true

  if (!useStore.token) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
