<template>
<div>
<!-- 面包屑 -->
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item><a href="/">权限列表</a></el-breadcrumb-item>
  
</el-breadcrumb>

<!-- 卡片区域 -->
    <el-card>
    <!-- 权限表 -->
        <el-table :data="rightData" border style="width: 100%" stripe>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="authName" label="权限名称" ></el-table-column>
            <el-table-column prop="path" label="路径" ></el-table-column>
            <el-table-column prop="level" label="权限等级">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level==0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.level==1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</div>
</template>

<script>
export default {
    data() {
        return{
            // 权限信息
            rightData:[],
        }
        
    },
    created(){
        this.getRightsInfo()
    },
    methods:{
        async getRightsInfo(){
            const {data:res} = await this.$http.get('rights/list')
            if(res.meta.status!==200) return this.$message.error("请求权限列表失败");
            console.log(res)
            this.rightData=res.data
        }
    }
}
</script>
<style scoped>
.el-breadcrumb {
    margin-bottom: 15px;
    font-size: 16px;
}
</style>