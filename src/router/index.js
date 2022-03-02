import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import GoodsCate from '../components/goods/GoodsCate.vue'
import Params from '../components/goods/Params.vue'
import Goods from '../components/goods/Goods.vue'
import AddGoods from '../components/goods/AddGoods.vue'


Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: User },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: GoodsCate },
            { path: '/params', component: Params },
            { path: '/goods', component: Goods },
            { path: '/goods/add', component: AddGoods },


        ]


    },
]

const router = new VueRouter({
    routes
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
    // to将要访问哪个路径
    // from 从哪个路径来
    // next放行
    if (to.path == '/login') return next()
        // 获取token
    const token = window.sessionStorage.getItem('token')
        // 没有登录，则跳转至登录页面
    if (!token) return next('/login')
    next()
})
export default router