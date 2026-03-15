import './assets/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import pinia from '@/stores/index'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/fonts/font.css' 


const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
