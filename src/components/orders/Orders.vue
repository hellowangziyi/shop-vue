<template>
<div>
    <!-- 面包屑导航区域 -->
    <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item><a href="#">订单列表</a></el-breadcrumb-item>
    </el-breadcrumb> -->
     <el-breadcrumb separator="/" >
        <el-breadcrumb-item v-for="bread in breadList" :key="bread.path" >{{bread.meta.title}}</el-breadcrumb-item>
        
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <!-- 搜索框 -->
        <el-row>
            <el-col :span="8">
                <el-input placeholder="请输入内容">
                    <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <!-- 表格 -->
         <el-table :data="ordersList" border stripe style="width: 100%">
             <el-table-column type="index" label="#"></el-table-column>
            <el-table-column prop="order_number" label="订单编号"  width="300"></el-table-column>
            <el-table-column prop="order_price" label="订单价格"></el-table-column>
            <el-table-column prop="pay_status" label="是否付款">
                <template slot-scope="scope">
                    <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                    <el-tag type="success" v-else>已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货"></el-table-column>
            <el-table-column prop="create_time" label="下单时间">
                <template slot-scope="scope">
                    {{scope.row.create_time | dateFormat}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template>
                    <el-tooltip effect="dark" content="修改地址" placement="top">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="addressdialogVisible = true"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="物流进度" placement="top">
                        <el-button type="success" icon="el-icon-edit" size="mini" @click="showProgressDialog"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
         </el-table>
         <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.queryInfo.pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="this.queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>

    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressdialogVisible" width="50%" @close="closeAddressDialog">
        <!-- 地址信息表单 -->
        <el-form :model="addressForm" :rules="addressRules" ref="addressRef" label-width="100px">
            <el-form-item label="省市区/县" prop="address1">
               <el-cascader
                    :options="cityOptions"
                    :value="addressForm.address1"
                    change-on-select
                >
                </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="address2">
                <el-input v-model="addressForm.address2"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addressdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressdialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>

        <!-- 物流信息对话框 -->
    <el-dialog title="物流信息" :visible.sync="progressdialogVisible" width="50%" >
        <el-timeline :reverse="reverse">
            <el-timeline-item
            v-for="(item, index) in progressInfo"
            :key="index"
            :timestamp="item.time">
            {{item.context}}
            </el-timeline-item>
        </el-timeline>
    </el-dialog>
</div>
</template>

 

<script>
import cityOptions from './citydata.js'
export default {
    data() {
        return {
            // 订单数据列表
            ordersList:[],
            // 查询参数
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            // 数据总条数
            total:0,
            // 修改地址对话框是否可见
            addressdialogVisible:false,
            // 地址表单
            addressForm:{},
            // 校验规则
            addressRules:{
                address1:[
                    { required: true, message: '请选择省市区/县', trigger: 'blur' },
                ],
                address2:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                ]
            },
            // 省市数据选项
            cityOptions: cityOptions,
            // 物流信息对话框是否可见
            progressdialogVisible:false,
            // 物流信息
            progressInfo:[],
            reverse: true,
        }
    },
    created(){
        this.getOrdersList()
    },
    mounted(){
        console.log(this.$route)
    },
    computed:{
        breadList(){
            return this.$route.matched
        }
    },
    methods:{
        // 获取订单列表数据
        async getOrdersList(){
            const {data:res} = await this.$http.get('/orders',{params:this.queryInfo})
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
             console.log(res.data)
             this.ordersList = res.data.goods
             this.total = res.data.total
        },
        // 分页 改变页面大小
        handleSizeChange(val){
            this.queryInfo.pagesize = val
            this.getOrdersList()
        },
        // 分页 改变页数
        handleCurrentChange(val){
            this.queryInfo.pagenum = val
            this.getOrdersList()
        },
        // 监听修改地址对话框关闭事件 重置表单
        closeAddressDialog(){
            this.$refs.addressRef.resetfeilfs()
        },
        async showProgressDialog(){
            const {data:res} = await this.$http.get('/kuaidi/804909574412544580')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.progressInfo = res.data
            this.progressdialogVisible = true
        }
    }
}
</script>

<style scoped>
.el-cascader {
    width: 100%;
}
</style>