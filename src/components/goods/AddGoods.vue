<template>
    <div>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#">添加商品</a></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
             <el-alert title="添加商品信息" type="info" show-icon :closable='false'></el-alert>
            <!-- 进度条 -->
            <el-steps :active="activeIndex - 0" finish-status="success"  align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!-- 表单 -->
            <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-position='top'> 
                <!-- 左侧导航栏 -->
                <el-tabs tab-position="left" v-model='activeIndex' :before-leave='beforeLeaveTabs' @tab-click='clickTabs'> 
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_name">
                           <el-cascader
                            v-model="selectedCate"
                            :options="parentCateList"
                            :props="{ expandTrigger: 'hover', label:'cat_name',value:'cat_id' }"
                            @change="handleChange" clearable @clear='clearSelect'></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item  v-for="(item,i) in manyPramasData" :key="i" :label="item.attr_name">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="val" v-for="(val,index) in item.attr_vals" :key="index" border></el-checkbox>
                             </el-checkbox-group>
                        </el-form-item>
            
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item v-for="(item,i) in onlyPramasData" :key="i" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 上传图片 -->
                        <el-upload :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :on-success="handleSuccess"
                            :file-list="fileList"
                            :headers="headerObj"
                            list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑框 -->
                        <quill-editor v-model="addForm.goods_introduce"/>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>

                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 预览对话框 -->
        <el-dialog title="预览图片" :visible.sync="previewDialogVisible" width="50%">
            <img :src="previewUrl" alt="" style="width:100%">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

export default {
    data() {
      return {
        //   导航栏激活的index
          activeIndex:'0',
        //   添加表单数据
        addForm:{
            goods_cat:[],
            pics:[],
            attrs:[]
        },
        selectedCate:[],
        addRules:{
              goods_name:[
                  { required: true, message: '请输入商品名称', trigger: 'blur' },
              ],
              goods_price:[
                  { required: true, message: '请输入商品价格', trigger: 'blur' },
              ],
              goods_number:[
                  { required: true, message: '请输入商品数量', trigger: 'blur' },
              ],
              goods_weight:[
                  { required: true, message: '请输入商品重量', trigger: 'blur' },
              ],
              goods_cat:[
                { required: true, message: '请输入商品分类', trigger: 'blur' },
              ]

        },
        // 商品分类列表
        parentCateList:[],
        // 动态参数数据
        manyPramasData:[],
        // 静态参数数据
        onlyPramasData:[],
        // 图片上传列表
        fileList:[],
        // 图片上传路径
        uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
        // 图片上传请求头
        headerObj:{
            Authorization:window.sessionStorage.getItem('token')
        },
        // 预览图片路径
        previewUrl:'',
        // 预览对话框
        previewDialogVisible:false
        
       

         
      }  
    },
    created(){
        this.getParentCateList()
    },
    methods:{
        // 获取商品分类数据，渲染级联选择器的选项
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories')
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.parentCateList = res.data
        },
        // 监听级联选择器的变化事件
        handleChange(){
            if(this.selectedCate.length !== 3){
                // 只允许选择三级分类
                return this.selectedCate = []
            }
        },
        // 切换Tab之前判断是否能切换
        beforeLeaveTabs(activeName, oldActiveName){
            if(oldActiveName==='0' && this.selectedCate.length !== 3){
                this.$message.info('请先选择商品分类')
                return false
            }
            return true
        },
        // 监听TAB点击事件
        async clickTabs(){
            // 点击了商品参数面板
            if(this.activeIndex === '1'){
                // 获取动态参数
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params:{sel:'many'}})
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                res.data.forEach(item =>{
                    item.attr_vals = item.attr_vals.length === 0?[]:item.attr_vals.split(' ')
                })
                this.manyPramasData = res.data

            }
            // 点击了静态属性面板
            if(this.activeIndex === '2'){
                // 获取静态参数
                const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params:{sel:'only'}})
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.onlyPramasData = res.data
            }
        },
        clearSelect(){
            this.addForm.goods_cat = []
        },
        // 图片上传成功处理函数
        handleSuccess(response){
            // 保存图片临时路径
            const picInfo = {pic: response.data.tmp_path}
            // 添加到数组
            this.addForm.pics.push(picInfo)
            
        },
        // 预览图片处理函数
        handlePreview(file){
            // 找到预览图片的url
            this.previewUrl = file.response.data.url
            // 打开对话框
            this.previewDialogVisible = true
        },
        // 删除上传图片处理函数
        handleRemove(file){
            // 找到该张照片在pics数组里的索引
            const index = this.addForm.pics.indexOf(file.response.data.tmp_path)
            // 在数组中删除
            this.addForm.pics.splice(index,1)
            console.log(this.addForm)
        },
        // 添加商品
        addGoods(){
            this.$refs.addFormRef.validate(async val => {
                if(!val){
                    this.$message.error('请先填写表单！')
                    return
                } 
                // 表单验证通过 处理需要提交的数据
                // 把goods_cat数组变成列表
                // 因为级联选择器绑定的goods_cat必须是数组 而这里把它变成了列表 所以会报错
                // 运用lodash cloneDeep(obj)进行深拷贝
                
                this.addForm.goods_cat = this.selectedCate.join(',')

                // 处理attrs数组
                this.manyPramasData.forEach(item =>{
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                this.onlyPramasData.forEach(item => {
                    const newInfo = {
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                console.log(this.addForm)
                // 提交给服务器
                const {data:res} = await this.$http.post('goods',this.addForm)
                if(res.meta.status !== 201) return this.$message.error(res.meta.msg)

                this.$message.success('添加成功！')
                this.$router.push('/goods')
            })
        }
        
    },
    computed:{
        cateId(){
            if(this.selectedCate.length === 3){
                return this.selectedCate[2]
            }
            return null
            
            
        }
    }
}
</script>

<style scoped>
.el-checkbox {
    margin: 0 10px 5px 0 !important;
}
.addBtn {
    margin-top: 15px;
}

</style>