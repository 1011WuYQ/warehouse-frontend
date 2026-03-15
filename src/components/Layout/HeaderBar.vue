<template>

    <div class="header">

        <div class="left">

            <h3>智能仓储数字孪生管理系统</h3>

        </div>

        <div class="right">

            <el-badge :value="3" class="item">
                <el-icon size="20">
                    <Bell />
                </el-icon>
            </el-badge>

            <span class="username">admin</span>

            <el-button type="danger" size="small" @click="logout">
                退出
            </el-button>

        </div>

    </div>

</template>

<script setup lang="ts">

import { Bell } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
    router.push('/login')
}

</script>

<style scoped>
.header {
    height: 60px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #eee;
}

.left h3 {
    margin: 0;
    font-weight: 500;
}

.right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.username {
    font-weight: 500;
}
</style>