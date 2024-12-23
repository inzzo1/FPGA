import './assets/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import pinia from '@/stores/index'
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
