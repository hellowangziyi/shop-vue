<template>
<div>
<!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="#">用户列表</a></el-breadcrumb-item>
    
</el-breadcrumb>
<!-- 卡片区域 -->
    <el-card>
        <el-row :gutter="20">
            <el-col :span="6">
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserInfo'>
                <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
                </el-input>
            </el-col>
            <el-col :span="6"><el-button type="primary"  @click="addDialogVisible = true">添加用户</el-button></el-col> 
        </el-row>
        <!-- 用户信息表 -->
        <el-table :data="tableData" border stripe style="width: 100%">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="username" label="用户名" ></el-table-column>
            <el-table-column prop="email" label="邮箱" ></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column prop="mg_state" label="状态">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change='userStateChange(scope.row)'></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
                
                    <el-tooltip class="item" effect="dark" content="修改用户状态" placement="top" :enterable='false'>
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                </template>
                
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close='addDialogClose'>
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close='editDialogClose'>
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名" >
            <el-input v-model="editForm.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 确定删除对话框 -->
    <el-dialog title="删除用户信息" :visible.sync="deleteDialogVisible" width="50%">
        确定删除？
        <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteUser">确 定</el-button>
        </span>
    </el-dialog>
</div>
</template>

<script>
export default {
    data(){
         // 自定义邮箱校验规则
            var checkEmail = (rule, value, cb)=>{
                const regEmail = /^[a-z\d]+(\.[a-z\d]+)*@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/
                
                if(regEmail.test(vaule)){
                    // 合法的邮箱 校验成功
                    return cb()
                }

                cb(new Error("请输入合法的邮箱"))
            }
            // 自定义手机的校验规则
            // var checkMobile = (rule, value, cb)=>{
                
            //     const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
            //     if(regMobile.test(value)){
            //         return cb()
            //     }
            //     cb(new Error('请输入合法的手机号'))
               
            // }
        return{
            // 用户信息
            tableData:[],
            
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            total:0,
            // 添加对话框是否可见
            addDialogVisible:false,
            // 添加用户
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            // 添加用户校验规则
            addFormRules:{
                username:[
                    { required: true, message: '请输入登录名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password:[
                     { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
                ],
                email:[
                    { required:true, message:'请输入邮箱', trigger:'blur' },
                    // { validator:checkEmail, trigger:'blur'}
                ],
                mobile:[
                    { required:true, message:'请输入手机', trigger:'blur' },
                    // { validator:checkMobile, trigger:'blur'}
                ]
            },
            // 修改信息用户框是否可见
            editDialogVisible: false,
            // 修改表单
            editForm:{
                // username:'',
                // password:'',
                // email:'',
                // mobile:''
            },
            // 修改校验规则
            editFormRules:{},
            // 删除用户对话框是否可见
            deleteDialogVisible:false
        }
    },
    created(){
        this.getUserInfo()
        
    },
    methods:{
        async getUserInfo(){
            const {data:res}= await this.$http.get('/users',{params:this.queryInfo})
            console.log(res)
            if(res.meta.status!=200) return this.$message.error("获取用户列表失败");
            this.tableData = res.data.users
            this.total = res.data.total
           
        },
        // 修改页面大小
        handleSizeChange(newSize){
            console.log(newSize)
            this.queryInfo.pagesize = newSize
            // 重新获取用户信息
            this.getUserInfo()
        },
        // 修改页数
        handleCurrentChange(newPage){
            console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getUserInfo()
        },
        // 监听switch状态改变
        async userStateChange(userinfo){
            const {data:res}= await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if(res.meta.status !=200){
                // 改变此时页面上的状态
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('修改用户状态失败')
            }
        },
        // 监听添加用户对话框是否关闭
        addDialogClose(){
            // 对话框关闭，重置表单
            this.$refs.addFormRef.resetFields()
           
        },
        // 添加用户
        addUser(){
             // 提交表单时预检验
            this.$refs.addFormRef.validate(async val=>{
                console.log(val)
                if(!val) return
                const {data:res} = await this.$http.post('users',this.addForm)
                if(res.meta.status!==201) return this.$message.error('添加用户失败')
                this.$message.success('添加用户成功')
                // 关闭对话框
                this.addDialogVisible = false
                // 重新获取用户列表
                this.getUserInfo()

            })
        },
        // 修改用户对话框
        async showEditDialog(id){
            this.editDialogVisible=true
            const {data:res} = await this.$http.get('users/'+id)
            if(res.meta.status!==200) return this.$message.error("查询用户失败")
            this.editForm=res.data
        },
        // 重置修改用户表单
        editDialogClose(){
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        editUser(){
            this.$refs.editFormRef.validate(async val =>{
                if(!val) return
                // 发起修改用户信息的请求
                const {data:res} = await this.$http.put('users/'+this.editForm.id)
                if(res.meta.status!=200) return this.$message.error('修改用户失败')
                // 修改成功，关闭对话框
                this.editDialogVisible=false
                // 刷新表格
                this.getUserInfo()
            })
        },
        // 删除用户对话框
        removeUser(id){
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 删除用户
                const {data:res} = await this.$http.delete('users/'+id)
                 if(res.meta.status!=200) return this.$message.error('删除用户失败')
                // 删除成功
                this.$message({
                type: 'success',
                message: '删除成功!'
                });
                //  刷新列表
                 this.getUserInfo()
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 删除用户
        async deleteUser(id){
            const {data:res} = this.$http.delete('users/'+id)
            if(res.meta.status!=200) return this.$message.error('删除用户失败')
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

