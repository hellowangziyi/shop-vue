<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#">商品分类</a></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 商品分类表 -->
            <tree-table class="treeTable"
            :data="goodCateData"
            :columns="columns"
            :selection-type='false'
            :expand-type='false'
            :show-row-hover='false'
            border
            show-index
            index-text='#'>
            <!-- 是否有效栏 -->
            <template slot="isDeleted" scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen; font-size:140%;"></i>
                <i class="el-icon-error" v-else  style="color:red;"></i>
            </template>
            <!-- 排序栏 -->
            <template slot="level" scope="scope">
                <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                <el-tag v-else-if="scope.row.cat_level===1" type="warning">二级</el-tag>
                <el-tag v-else type="success">三级</el-tag>
            </template>
            <!-- 操作栏 -->
            <template slot="operation" scope="scope">
                <el-button type="primary" size='mini' icon="el-icon-edit" @click="showEditCateDialog(scope.row)">编辑</el-button>
                <el-button type="danger" size='mini' icon="el-icon-delete" @click="deleteCate(scope.row.cat_id)">删除</el-button>
            </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加商品分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%" @close='closeAddCateDialog'>
        <!-- 表单 -->
            <el-form ref="addCateRef" :model="addCateForm" :rules="addCateRules" label-width="100px"  >
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!-- 级联选择器 -->
                    <el-cascader placeholder='请选择分类' clearable 
                    v-model="selectedKey"
                    :options="parentCateList"
                    :props="{ expandTrigger: 'hover', label:'cat_name', value:'cat_id', checkStrictly:true }"
                     @change="handleChange"
                    
                    >
                    </el-cascader>
                    
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate" >确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑商品分类对话框 -->
        <el-dialog
            title="编辑分类"
            :visible.sync="editCateVisible"
            width="50%">
            <el-form ref="editform" :model="editForm" label-width="100px">
                <el-form-item label="分类名称" >
                <el-input v-model="editForm.cat_name"></el-input>
            </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除商品分类 -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 请求参数
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 商品分类数据
            goodCateData:[],
            // 总数据条数
            total:0,
            // 树形表格
            columns:[
                {
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    prop: 'cat_deleted',
                    type:'template',
                    template:'isDeleted'
                },
                {
                    label: '排序',
                    prop: 'cat_level',
                    type:'template',
                    template:'level'

                },
                {
                    label: '操作',
                    type:'template',
                    template:'operation'
                }
            ],
            // 添加分类对话框是否可见
            addCateVisible:false,
            // 添加分类表单数据
            addCateForm:{
                cat_name:'',
                // 默认一级分类
                cat_pid:0,
                cat_level:0
            },
            // 添加分类校验规则
            addCateRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            // 父级分类列表
            parentCateList:[],
            // 被选中的分类
            selectedKey:[],
            // 编辑对话框是否可见
            editCateVisible:false,
            // 编辑表单的数据
            editForm:{
                cat_name:''
            }

        }
    },
    created(){
        this.getGoodCateData()
    },
    methods:{
        async getGoodCateData(){
            const {data:res} = await this.$http.get('categories',{params: this.queryInfo})
            console.log(res.data)
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.goodCateData = res.data.result
            this.total= res.data.total
           
        },
        // 修改每页显示条数
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize
            this.getGoodCateData()
        },
        // 修改当前页
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getGoodCateData()

        },
        // 点击按钮显示添加分类对话框
        showAddCateDialog(){
            // 先获取父级分类列表
            this.getParentCateList()
            // 打开对话框
            this.addCateVisible = true
        },
        // 获取父级分类列表
        async getParentCateList(){
            // 选择的时候只用最多显示二级分类
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
             if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
             this.parentCateList = res.data

        },
        handleChange(){
            // 有选中的分类
            if(this.selectedKey.length > 0){
                // 数组最后一个即为需要的pid
                this.addCateForm.cat_pid = this.selectedKey[this.selectedKey.length - 1]
                this.addCateForm.cat_level = this.selectedKey.length
            }
            else{
                // 若没有选中的分类或者清除了，则改为0
                this.addCateForm.cat_pid = 0
                this.addCateForm.cat_level = 0
            }
        },
        // 点击确认添加分类
        addCate(){
            this.$refs.addCateRef.validate(async valid =>{
                if(!valid) return 
                const {data:res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
                // 成功
                this.$message.success('添加分类成功！')
                // 关闭对话框
                this.addCateVisible = false
                // 刷新列表
                this.getGoodCateData()
            }
            )
            

        },
        // 监听关闭添加分类对话框事件，重置表单
        closeAddCateDialog(){
            this.$refs.addCateRef.resetFields()
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
            this.selectedKey = []
        },
        // 显示编辑对话框
        async showEditCateDialog(cate){
            // 根据id查询分类
            const {data:res} = await this.$http.get(`categories/${cate.cat_id}`)
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.editForm = res.data
            // 显示对话框
            this.editCateVisible = true
        },
        // 编辑商品分类
        async editCate(){
            const {data:res} = await this.$http.put(`categories/${this.editForm.cat_id}`, {cat_name:this.editForm.cat_name})
             if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
             console.log(res)
            //  成功
            this.$message.success("编辑成功！")
            this.editCateVisible = false
            this.getGoodCateData()
        },
        // 删除商品分类
        deleteCate(id){
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            // 删除
            const {data:res} = await this.$http.delete('categories/'+id)
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            // 成功提示
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            // 刷新
            this.getGoodCateData()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        }
    }
}
</script>

<style scoped>
.treeTable {
    margin-top: 10px;
}
.el-cascader {
    width: 100%;
}


</style>