<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#">参数列表</a></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-alert
                title="注意：只允许为第三级分类设置参数！"
                type="warning"
                show-icon>
            </el-alert>
            <el-row>
                <el-col>
                选择商品分类：
                <el-cascader placeholder='请选择分类' clearable 
                    v-model="selectedKey"
                    :options="parentCateList"
                    :props="{ expandTrigger: 'hover', label:'cat_name', value:'cat_id'}"
                     @change="handleChange"
                    >
                </el-cascader>
                </el-col>
            </el-row>
            <!-- Tabs切换栏 -->
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数按钮 -->
                    <el-button type="primary" :disabled='isBtnDisabled' @click="addParamsdialogVisible = true">添加参数</el-button>
                    <!-- 参数表格 -->
                    <el-table :data="manyTableParams" style="width: 100%" stripe border>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环attr_vals数组 -->
                                <el-tag  v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='closeTags(scope.row,i)'>{{item}}</el-tag>
                                <!-- 新增标签 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                autofocus
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size='mini' icon="el-icon-edit" @click="showEditParamsDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" size='mini' icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled='isBtnDisabled' @click="addParamsdialogVisible = true">添加属性</el-button>
                    <!-- 参数表格 -->
                    <el-table :data="onlyTableParams" style="width: 100%" stripe border>
                        <!-- 展开列 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环attr_vals数组 -->
                                <el-tag  v-for="(item,i) in scope.row.attr_vals" :key='i' closable @close='closeTags(scope.row,i)'>{{item}}</el-tag>
                                <!-- 新增标签 -->
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                autofocus
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size='mini' icon="el-icon-edit" @click="showEditParamsDialog(scope.row)">编辑</el-button>
                                <el-button type="danger" size='mini' icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数对话框(动态和静态共用) -->
        <el-dialog
            :title="'添加'+ titleText"
            :visible.sync="addParamsdialogVisible"
            width="50%" @close='addParamsClose'>
            <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑参数对话框(动态和静态共用) -->
        <el-dialog
            :title="'编辑'+ titleText"
            :visible.sync="editParamsdialogVisible"
            width="50%" @close='editParamsClose'>
            <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsRef" label-width="100px" class="demo-ruleForm">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editParamsForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamsdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 级联选择框的父级分类列表
            parentCateList:[],
            // 级联选择框选中的值
            selectedKey:[],
            // 选中的Tab值 默认第一个(动态参数)
            activeName:'many',
            // 动态参数列表
            manyTableParams:[],
            // 静态参数列表
            onlyTableParams:[],
            // 添加参数对话框是否可见
            addParamsdialogVisible:false,
            // 添加参数表单的数据
            addParamsForm:{},
            // 添加参数校验规则
            addParamsRules:{
                attr_name:[
                    { required: true, message: '请输入属性名称', trigger: 'blur' },
                ]
            },
            // 编辑参数对话框是否可见
            editParamsdialogVisible:false,
            // 编辑参数数据
            editParamsForm:{},
            // 编辑参数的校验规则
            editParamsRules:{
                attr_name:[
                    { required: true, message: '请输入属性名称', trigger: 'blur' },
                ]
            },
            // 新增标签是否可见
            inputVisible:false,
            // 新增标签数据
            inputValue:""
        }
    },
    created(){
        this.getParentCateList()
    },
    methods:{
        // 获取级联选择框的选择列表
        async getParentCateList(){
            // 默认获取所有参数
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.parentCateList = res.data
        },
        // 监听级联选择器的变化
        handleChange(){
            // 如果没有选择第三极，则自行清空
            if(this.selectedKey.length !== 3){
                this.selectedKey = []
                // 同时清空表格
                this.manyTableParams = []
                this.onlyTableParams = []
                this.
                return
            }
            // 选择了第三级
            this.getParamsData()
        },
        // 监听Tab栏点击事件
        handleTabsClick(){
           this.getParamsData()
        },
        // 获取参数列表数据
        async getParamsData(){
            const {data:res} = await this.$http.get(`categories/${this.selectedKey[this.selectedKey.length - 1]}/attributes`, {params:{sel:this.activeName}})
             if(res.meta.status !== 200) return this.$message.error(res.meta.msg)

            // 将attr_vals字符串分割为数组
            res.data.forEach(item => {
                // 解决attr_vals为空字符串时候的小问题
                item.attr_vals = item.attr_vals?item.attr_vals.split(' '):[]
                // 给每一行绑定inputVisible和inputValue值
                item.inputVisible = false
                item.inputValue = ''
            });

            //  将获取到的数据挂载到不同的数据源上
            if(this.activeName == 'many'){
                this.manyTableParams = res.data
            }else{
                this.onlyTableParams = res.data
            }
        },
        // 添加动态或静态参数
        addParams(){
            this.$refs.addParamsRef.validate(async val =>{
                if(!val) return 
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addParamsForm.attr_name, attr_sel:this.activeName})
                if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
                // 添加成功
                this.$message.success('添加成功！')
                this.addParamsdialogVisible = false
                this.getParamsData()
            })
            
        },
        // 重置添加参数表单
        addParamsClose(){
            this.$refs.addParamsRef.resetFields()
        },
        // 重置编辑参数列表
        editParamsClose(){
            this.$refs.editParamsRef.resetFields()
        },
        // 显示编辑参数对话框
        async showEditParamsDialog(scope){
            // 根据id查询参数
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${scope.attr_id}`,{params: {attr_sel:this.activeName}})
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            // 赋值给表单
            this.editParamsForm = res.data
            // 打开对话框
            this.editParamsdialogVisible = true
        },
         // 编辑参数
        editParams(){
            this.$refs.editParamsRef.validate(async val => {
                if(!val) return
                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,{attr_name:this.editParamsForm.attr_name, attr_sel:this.activeName})
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                // 编辑成功
                this.$message.success('编辑成功！')
                this.editParamsdialogVisible = false
                this.getParamsData()
            })
            
        },
        // 删除参数
        deleteParams(scope){
            this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(async() => {
                    const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${scope.attr_id}`)
                    if(res.meta.status !== 200) return this.$message.error('删除失败！')
                    this.$message.success('删除成功!') 
                    // 重新
                    this.getParamsData()
            
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            })
        },
        // 显示标签输入框
        showInput(row){
            row.inputVisible = true
            // 输入框自动获取焦点
            // $nextTick方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            })
        },
        // 确认新增标签
       async handleInputConfirm(row){
            // 未输入值    
           if(row.inputValue.trim().length === 0){
               row.inputVisible = false
               row.inputValue = ''
                return
           }
            // 添加参数
            row.attr_vals.push(row.inputValue.trim())
            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {attr_name:row.attr_name, attr_sel:this.activeName, attr_vals:row.attr_vals.join(' ')})
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            // 添加成功
            this.$message.success('添加成功！')
            row.inputVisible = false
            row.inputValue = ''

       },
       async closeTags(row,index){
           row.attr_vals.splice(index,1)
           const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {attr_name:row.attr_name, attr_sel:this.activeName, attr_vals:row.attr_vals.join(' ')})
           if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
           this.$message.success('删除成功！')

       }

        
    },
    computed:{
        isBtnDisabled(){
            // 若没有选择第三级，则禁用按钮
            if(this.selectedKey.length !== 3){
                return true
            }
            return false
        },
        // 选中分类id
        cateId(){
            if(this.selectedKey.length === 3){
                return this.selectedKey[2]
            }
            return null
        },
        // 添加动态or静态参数
        titleText(){
            if(this.activeName === 'many'){
                return '动态参数'
            }else{
                return '静态属性'
            }
        }
    }
}
</script>

<style scoped>
.el-alert {
    margin-bottom: 16px;
}
.el-tag {
    margin: 8px;
}
.el-tabs {
    margin:20px 0 ;
}
.button-new-tag {
    margin-left: 10px;
}
.input-new-tag {
    width: 120px;
    margin-left: 10px;
  }
</style>