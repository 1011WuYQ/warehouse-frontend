<template>

    <el-card>

        <div class="header">

            <h3>用户管理</h3>

            <el-button type="primary">新增用户</el-button>

        </div>

        <el-table :data="users">

            <el-table-column prop="id" label="ID" width="80" />

            <el-table-column prop="name" label="用户名" />

            <el-table-column prop="role" label="角色" />

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

const users = ref([
    { id: 1, name: 'admin', role: '管理员', status: '启用' },
    { id: 2, name: 'operator', role: '操作员', status: '启用' }
])

</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}
</style>