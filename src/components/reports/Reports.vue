<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item><a href="#">数据报表</a></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
            <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import _ from 'lodash'
export default {
    data() {
      return {
            // 指定图表的配置项和数据
        option:{
            title: {
            text: '用户来源'
            },
            tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                backgroundColor: '#E9EEF3'
                }
            }
            },
            grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
            },
            xAxis: [
            {
                boundaryGap: false
            }
            ],
            yAxis: [
            {
                type: 'value'
            }
            ]
        }
      }  
    },
    created(){

    },
    // 渲染DOM后
    async mounted(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
        //   获取数据
        const {data:res} = await this.$http.get('reports/type/1')
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
   
        // 合并数据
        _.merge(res.data, this.option)

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(res.data);
    },
    methods:{

    }
}
</script>

<style scoped>

</style>