import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 你的路由

// 1. 引入 Element Plus 及样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 2. 引入中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

// 3. 全局配置 Element Plus 使用中文
app.use(ElementPlus, { locale: zhCn })

app.use(router)
app.mount('#app')