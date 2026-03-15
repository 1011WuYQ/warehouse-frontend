<template>

    <div class="sidebar">

        <div class="logo">
            <h2>Warehouse DT</h2>
        </div>

        <el-menu router class="menu" background-color="#1f2d3d" text-color="#fff" active-text-color="#409EFF">

            <el-menu-item index="/">
                <el-icon>
                    <House />
                </el-icon>
                <span>系统首页</span>
            </el-menu-item>

            <el-menu-item index="/system/warehouse">
                <el-icon>
                    <Box />
                </el-icon>
                <span>三维仓库</span>
            </el-menu-item>

            <el-menu-item index="/system/asset">
                <el-icon>
                    <Management />
                </el-icon>
                <span>资产管理</span>
            </el-menu-item>

            <el-menu-item index="/system/monitor">
                <el-icon>
                    <Monitor />
                </el-icon>
                <span>设备监控</span>
            </el-menu-item>

            <el-menu-item index="/system/user">
                <el-icon>
                    <User />
                </el-icon>
                <span>用户管理</span>
            </el-menu-item>

        </el-menu>

    </div>

</template>

<script setup lang="ts">

import {
    House,
    Box,
    Management,
    Monitor,
    User
} from '@element-plus/icons-vue'

</script>

<style scoped>
.sidebar {
    width: 220px;
    height: 100vh;
    background: #1f2d3d;
    display: flex;
    flex-direction: column;
}

.logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    border-bottom: 1px solid #2d3a4b;
}

.menu {
    border: none;
    flex: 1;
}
</style>