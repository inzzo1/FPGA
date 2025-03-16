import './assets/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import pinia from '@/stores/index'
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

const app = createApp(App)
app.use(pinia)
app.use(ElementPlus)
app.use(router)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

// // WebSocket通讯
// import { useSocketStoreWithOut } from '/@/stores/useSocketStore'
// import VueNativeSock from 'vue-native-websocket-vue3'
// const piniaSocketStore = useSocketStoreWithOut(app)
// app.use(VueNativeSock, `你的websocket服务端连接地址`, {
//   store: piniaSocketStore,
//   // 数据发送/接收使用使用json
//   format: 'json',
//   // 开启手动调用 connect() 连接服务器
//   connectManually: true,
//   // 开启自动重连
//   reconnection: true,
//   // 尝试重连的次数
//   reconnectionAttempts: 5,
//   // 重连间隔时间
//   reconnectionDelay: 3000,
// })
