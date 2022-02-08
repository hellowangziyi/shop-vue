import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 配置axios
import axios from 'axios'
Vue.prototype.$http = axios
    // 配置axios根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // axios请求拦截器来添加token，以保证拥有获取数据的权限
axios.interceptors.request.use(config => {
    //为请求头对象，添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')