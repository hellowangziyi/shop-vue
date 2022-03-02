import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入树形表格
import TreeTable from 'vue-table-with-tree-grid'

// 富文本编辑框
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */ )



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

// 注册树形表格
Vue.component('tree-table', TreeTable)

// 日期格式过滤器
Vue.filter('dateFormat', function(val) {
    var dt = new Date(val)
    var y = dt.getFullYear()
    var m = (dt.getMonth() + 1 + '').padStart(2, '0')
    var d = (dt.getDate() + '').padStart(2, '0')

    var HH = (dt.getHours() + '').padStart(2, '0')
    var MM = dt.getMinutes()
    var SS = dt.getSeconds()
    return `${y}-${m}-${d} ${HH}:${MM}:${SS}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')