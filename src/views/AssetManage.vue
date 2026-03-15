<template>

    <el-card>

        <div class="header">

            <h3>资产管理</h3>

            <el-button type="primary">新增资产</el-button>

        </div>

        <el-table :data="assets">

            <el-table-column prop="id" label="资产ID" width="120" />

            <el-table-column prop="name" label="资产名称" />

            <el-table-column prop="type" label="类型" />

            <el-table-column prop="status" label="状态" />

            <el-table-column label="操作">

                <template #default>
                    <el-button size="small">编辑</el-button>
                    <el-button size="small" type="danger">删除</el-button>
                </template>

            </el-table-column>

        </el-table>

    </el-card>

</template>

<script setup lang="ts">

import { ref } from 'vue'

const assets = ref([
    { id: 1, name: '货架A01', type: '货架', status: '正常' },
    { id: 2, name: 'AGV小车1', type: '运输设备', status: '运行' },
    { id: 3, name: '温度传感器', type: '传感器', status: '在线' }
])

</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
</style>