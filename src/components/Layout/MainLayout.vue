<template>

    <div class="layout">

        <Sidebar />

        <div class="main">

            <HeaderBar />

            <div class="content">
                <router-view />
            </div>

        </div>

    </div>

</template>

<script setup lang="ts">

import Sidebar from "./Sidebar.vue";
import HeaderBar from './HeaderBar.vue'

</script>

<style>
.layout {
    display: flex;
    height: 100vh;
}

.main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f5f7fa;
}

.content {
    flex: 1;
    padding: 20px;
    overflow: auto;
}
</style>