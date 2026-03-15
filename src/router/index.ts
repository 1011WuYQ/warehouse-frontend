import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Warehouse3D from '../views/Warehouse3D.vue'
import AssetManage from '../views/AssetManage.vue'
import DeviceMonitor from '../views/DeviceMonitor.vue'
import UserManage from '../views/UserManage.vue'

import MainLayout from '../components/Layout/MainLayout.vue'

const routes: Array<RouteRecordRaw> = [

    {
    path:'/',
    redirect:'/login'
    },
    
    {
    path:'/login',
    component:Login
    },
    
    {
    path:'/system',
    component:MainLayout,
    redirect:'/system/dashboard',
    children:[
    
    {
    path:'dashboard',
    component:Dashboard
    },
    
    {
    path:'warehouse',
    component:Warehouse3D
    },
    
    {
    path:'asset',
    component:AssetManage
    },
    
    {
    path:'monitor',
    component:DeviceMonitor
    },
    
    {
    path:'user',
    component:UserManage
    }
    
    ]
    }
    
    ]

const router = createRouter({
history:createWebHistory(),
routes
})

export default router