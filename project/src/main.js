import './assets/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import pinia from '@/stores/index'
import { createApp } from 'vue'
import App from './App.vue'
import { useUserStore } from '@/stores/modules/users'
import router from './router'
import '@/assets/fonts/font.css' 
import { installAutoStop } from '@/utils/autoStop'


const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


// === 这里写固定 token（仅开发环境注入） ===
if (import.meta.env.MODE === 'development') {
  const userStore = useUserStore()
  userStore.setToken('eyJhbGciOiJIUzI1NiJ9.dev.mock.token')
}

installAutoStop()

app.mount('#app')
