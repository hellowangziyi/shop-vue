<template>
    <el-container class="home-container">
        <!-- 顶部区域 -->
        <el-header>
            <div>
                <!-- logo -->
                <img src="../assets/heima.png" alt="logo">
                <!-- 标题 -->
                <span>后台管理系统</span>

            </div>
            <el-button type="info" @click="logout">退出</el-button>
            </el-header>
        <el-container>
            <!-- 侧栏区域 -->
            <el-aside :width="isCollapse?'64px':'200px'">
      
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b" unique-opened :collapse='isCollapse' :collapse-transition='false' router :default-active='activePath'>
                    <div class="toggleButton" @click="toggleCollapse">|||</div>
                    <el-submenu v-for="item in menuList" :index="item.id+''" :key="item.id">
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item v-for="i in item.children" :index="'/'+i.path" :key='i.id' @click="getActive('/'+i.path)">
                            <i class="el-icon-menu"></i>
                            <span>{{i.authName}}</span>
                        </el-menu-item>
                        
                    </el-submenu>
    </el-menu>
            </el-aside>
            <!-- 内容区域 -->
            <el-main>
                <!-- 占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单数据
            menuList: [],

            //icon图标数据 
            iconObj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            // 是否展开侧栏
            isCollapse:false,
            // 激活路径
            activePath:''
        }
        
    },
    created(){
        // 在created阶段请求左侧菜单数据
        this.getMenuList()
        this.activePath=window.sessionStorage.getItem('activePath')
    },
    methods:{
        logout() {
            // 清除token
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList() {
            const {data:res} = await this.$http.get('menus')
            console.log(res)
            if(res.meta.status!=200) return this.$message.error('获取菜单失败');
            this.menuList=res.data
        },
        toggleCollapse(){
            this.isCollapse = !this.isCollapse
        },
        getActive(path){
            window.sessionStorage.setItem('activePath',path)
            this.activePath=path
        }
    }
}
</script>

<style  scoped>
.home-container{
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    
}
.el-header div {
    display: flex;
    align-items: center;
}
.el-header div span {
    margin-left: 15px;
}
.el-aside {
    background-color: #333744;
}
.el-main{
  background-color:#eaedf1;
}
.el-menu {
    border-right: none;
}
.iconfont {
    margin-right: 10px;
}
.toggleButton {
    background-color: #4a5064;
    color: #fff;
    text-align: center;
    line-height: 24px;
    letter-spacing: .2rem;
    cursor: pointer;
}
</style>