<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#">商品列表</a></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="9">
                     <el-input placeholder="请输入内容" v-model="this.queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click='getGoodsList'></el-button>
                    </el-input>
                </el-col>
                <el-col :span="10">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>
            <!-- 商品表格 -->
            <el-table :data="goodsList"  border stripe style="width: 100%">
                <el-table-column type="index" label="#" ></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
                <el-table-column prop="goods_price" label="商品价格（元）" width="95px" ></el-table-column>
                <el-table-column prop="goods_number" label="商品数量" width="70px"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页栏 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="this.queryInfo.pagenum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="this.queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="this.total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品列表
            goodsList:[],
            // 请求参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            // 
            total:0,
            
            
        }
        
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        // 获取商品列表
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.goodsList = res.data.goods
            this.total = res.data.total
        },
        // 修改每页显示条数
        handleSizeChange(val){
            this.queryInfo.pagesize = val
            this.getGoodsList()
        },
        // 修改当前页
        handleCurrentChange(val){
            this.queryInfo.pagenum = val
            this.getGoodsList()
        },
        deleteGoods(id){
             this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async () => {
                    const {data:res} = await this.$http.delete(`goods/${id}`)
                    if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            // 刷新表单
            this.getGoodsList()
        },
        // 添加商品
        goAddPage(){
            this.$router.push('/goods/add')
        }
    },
    
}
</script>

<style scoped>

</style>