<template>

    <div class="dashboard">

        <el-row :gutter="20">

            <el-col :span="6">
                <el-card class="stat">
                    <h3>设备总数</h3>
                    <p class="num">128</p>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="stat">
                    <h3>在线设备</h3>
                    <p class="num green">120</p>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="stat">
                    <h3>离线设备</h3>
                    <p class="num red">8</p>
                </el-card>
            </el-col>

            <el-col :span="6">
                <el-card class="stat">
                    <h3>仓库货架</h3>
                    <p class="num">54</p>
                </el-card>
            </el-col>

        </el-row>

        <el-card class="chart">

            <h3>仓库运行状态</h3>

            <div class="chart-box">
                设备运行数据图表区域
            </div>

        </el-card>

    </div>

</template>

<script setup lang="ts">

</script>

<style scoped>
.dashboard {
    padding: 20px;
}

.stat {
    text-align: center;
}

.num {
    font-size: 28px;
    margin-top: 10px;
}

.green {
    color: #67c23a;
}

.red {
    color: #f56c6c;
}

.chart {
    margin-top: 20px;
}

.chart-box {
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f7fa;
}
</style>