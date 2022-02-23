<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">角色列表</a></el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRoleVisible=true">添加角色</el-button>
                </el-col>
            </el-row>
            

            <!-- 角色表 -->
            <el-table :data="rolesData" border style="width: 100%" stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        
                        <el-row :class="['bdbottom',i1=== 0?'bdtop':'','vcenter']" v-for="(item1, i1) in scope.row.children" :key='item1.id'> 
                            <!-- 第一级 -->
                            <el-col :span="5" class="vcenter" >
                                <el-tag  closable  @close='handleCloseTag(scope.row, item1.id)'>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 第二级和第三级 -->
                            <el-col :span="19">
                                <!-- 第二级循环 -->
                                <el-row :class="[i2 === 0?'':'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key='item2.id'>
                                    <el-col :span="6">
                                        <el-tag type="success" closable  @close='handleCloseTag(scope.row, item2.id)'>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18" >
                                        <!-- 第三级循环 -->
                                        <el-tag type="warning" closable v-for="(item3) in item2.children" :key='item3.id' @close="handleCloseTag(scope.row, item3.id)">{{item3.authName}}</el-tag> 
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        {{scope.row}}
                    </template>
                    
                </el-table-column>
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="roleName" label="角色名称" ></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" width='300px'>
                    <el-button type="primary" icon="el-icon-edit" size="small" >编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" >删除</el-button>
                    <el-button type="warning" icon="el-icon-view" size="small" @click="showSetRightsDialog(scope.row)">查看权限</el-button> 
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="50%" @close='addRoleClose'>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                <el-input v-model="addForm.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleVisible = false">取 消</el-button>
                <el-button type="primary">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 查看权限对话框 -->
        <el-dialog title="分配权限" :visible.sync='showSetRightsVisible' width="50%" @close='closeSetRightDialog'>
           <el-tree :data="rightsList" ref='treeRef' :props="defaultProps" show-checkbox  node-key="id" default-expand-all :default-checked-keys='defaultKeys'></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showSetRightsVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateRight">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
     return {
        //  角色信息表
         rolesData:[],
        //  添加角色对话框是否可见
         addRoleVisible:false,
        //  添加角色信息表单
        addForm:{},
        // 添加角色校验规则
        addFormRules:{
            roleName:[
                {required:true, message:'请输入角色名', trigger:'blur'}
            ],
            roleDesc:[
                 {required:true, message:'请输入角色描述', trigger:'blur'}
            ]
        },
        // 权限分配对话框
        showSetRightsVisible:false,
        // 所有权限列表
        rightsList:[],
        //树形控件
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        // 默认勾选的id数列
        defaultKeys:[],
        // 暂存当前角色id
        currentId:0,
     }   
    },
    created(){
        this.getRolesList()
    },
    methods:{
        async getRolesList(){
            const {data:res} = await this.$http.get('roles')
            if(res.meta.status!==200) return this.$message.error("获取角色列表失败")
            this.rolesData = res.data
        },
        addRoleClose(){
           this.$refs.addFormRef.resetFields()
            console.log('关闭了对话框')
        },
        handleCloseTag(role, rightId){
              this.$confirm('确定删除该权限?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
             }).then(async () => {
                 // 删除权限
                const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                console.log(res)
                if(res.meta.status !== 200) return this.$message.error('删除失败！')
                
                // 消息弹窗
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
                role.children = res.data
             }

             )
             .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 查看角色权限
        async showSetRightsDialog(role){
            // 获取所有权限列表
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status !== 200) return this.$message.error("获取权限列表失败！")
            // 保存数据
            this.rightsList = res.data
            console.log(this.rightsList)

            // 通过递归获取默认勾选节点
            this.searchLeafKeys(role ,this.defaultKeys)
            // 暂存当前角色id
            this.currentId = role.id
            // 显示对话框
            this.showSetRightsVisible = true
            
            

        },
        // 递归求当前角色下所有三级权限的id
        searchLeafKeys(node, arr){
            if(!node.children){
                // 如果当前节点不包括孩子，则为三级节点，加入数组
                return arr.push(node.id)
            }

            node.children.forEach(item =>{
                this.searchLeafKeys(item, arr)
            })
        },
        // 关闭权限分配对话框
        closeSetRightDialog(){
            this.defaultKeys=[]
        },
        // 更新权限
        async updateRight(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr = keys.join(',')
            const {data:res} = await this.$http.post(`roles/${this.currentId}/rights`,{rids:idStr})
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            // 关闭对话框
            this.showSetRightsVisible=false
            // 更新列表
            this.getRolesList()
        }

    }
        
    
}
</script>

<style scoped>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top:1px solid #eee
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

/* 居中 */

.vcenter {
    display: flex;
    align-items: center;
}
</style>