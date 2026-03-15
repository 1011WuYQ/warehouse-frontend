<template>

    <div class="monitor">

        <el-row :gutter="20">

            <el-col :span="12">

                <el-card>

                    <h3>设备状态</h3>

                    <el-table :data="devices">

                        <el-table-column prop="id" label="设备ID" />

                        <el-table-column prop="name" label="设备名称" />

                        <el-table-column prop="status" label="状态" />

                    </el-table>

                </el-card>

            </el-col>

            <el-col :span="12">

                <el-card>

                    <h3>报警信息</h3>

                    <el-table :data="alarms">

                        <el-table-column prop="time" label="时间" />

                        <el-table-column prop="msg" label="报警信息" />

                    </el-table>

                </el-card>

            </el-col>

        </el-row>

    </div>

</template>

<script setup lang="ts">

import { ref } from 'vue'

const devices = ref([
    { id: 1, name: 'AGV-01', status: '运行' },
    { id: 2, name: 'AGV-02', status: '待机' }
])

const alarms = ref([
    { time: '10:20', msg: '温度过高' },
    { time: '11:10', msg: '设备离线' }
])

</script>

<style scoped>
.monitor {
    padding: 20px;
}
</style>