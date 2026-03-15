<template>
    <div class="warehouse-root">
        <!-- 左侧设备树 -->
        <div class="panel-left">
            <el-card shadow="never" class="full">
                <template #header>仓库设备</template>
                <el-tree :data="treeData" node-key="id" default-expand-all highlight-current
                    @node-click="onTreeClick" />
            </el-card>
        </div>

        <!-- 中间三维 -->
        <div class="panel-center">
            <div class="toolbar">
                <el-button size="small" @click="resetCamera">重置视角</el-button>
                <el-button size="small" @click="toggleGrid">
                    {{ gridVisible ? '隐藏网格' : '显示网格' }}
                </el-button>
                <el-button size="small" type="success" @click="toggleAGV">
                    {{ agvRunning ? '停止AGV' : '启动AGV' }}
                </el-button>
            </div>
            <div ref="threeEl" class="three"></div>
        </div>

        <!-- 右侧设备信息 -->
        <div class="panel-right">
            <el-card shadow="never" class="full">
                <template #header>设备信息</template>
                <el-descriptions :column="1" border>
                    <el-descriptions-item label="名称">{{ device.name }}</el-descriptions-item>
                    <el-descriptions-item label="类型">{{ device.type }}</el-descriptions-item>
                    <el-descriptions-item label="状态">
                        <el-tag :type="device.type === 'AGV' ? 'warning' : 'success'">
                            {{ device.status }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="位置">
                        {{ device.position }}
                    </el-descriptions-item>
                </el-descriptions>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// --------------------- DOM ---------------------
const threeEl = ref<HTMLDivElement | null>(null)

// --------------------- Three 基础对象 ---------------------
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let grid: THREE.GridHelper

// 交互
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// 仓库对象集合
const shelves: THREE.Mesh[] = []
let agv: THREE.Mesh
let agvCurve: THREE.CatmullRomCurve3
let agvT = 0
const agvSpeed = 0.0008
const agvRunning = ref(false)

// UI 状态
const gridVisible = ref(true)
const device = ref({
    name: '未选择',
    type: '-',
    status: '-',
    position: '-'
})

// 设备树
const treeData = [
    {
        id: 1,
        label: '仓库',
        children: [
            { id: 2, label: '货架区' },
            { id: 3, label: 'AGV 小车' }
        ]
    }
]

// --------------------- 初始化 ---------------------
function init() {
    if (!threeEl.value) return

    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f7fa)

    // Camera
    const w = threeEl.value.clientWidth
    const h = threeEl.value.clientHeight
    camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000)
    camera.position.set(40, 40, 40)

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    threeEl.value.appendChild(renderer.domElement)

    // Controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    // Light
    const dir = new THREE.DirectionalLight(0xffffff, 1)
    dir.position.set(30, 50, 30)
    scene.add(dir)
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))

    // Grid
    grid = new THREE.GridHelper(100, 20, 0x888888, 0xcccccc)
    scene.add(grid)

    // Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshStandardMaterial({ color: 0xe8e8e8 })
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)

    // Boundary (仓库边界线)
    const box = new THREE.BoxGeometry(80, 0.2, 60)
    const line = new THREE.LineSegments(
        new THREE.EdgesGeometry(box),
        new THREE.LineBasicMaterial({ color: 0x666666 })
    )
    line.position.y = 0.1
    scene.add(line)

    // 货架矩阵
    createShelves(6, 5, 6, 5)

    // AGV + 路径
    createAGV()
    createAGVPath()

    // 事件
    window.addEventListener('resize', onResize)
    renderer.domElement.addEventListener('pointerdown', onPointer)

    // 动画
    animate()
}

// --------------------- 货架生成 ---------------------
function createShelves(rows: number, cols: number, gapX: number, gapZ: number) {
    const geo = new THREE.BoxGeometry(3, 8, 1)
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const mat = new THREE.MeshStandardMaterial({ color: 0x409eff })
            const shelf = new THREE.Mesh(geo, mat)
            shelf.position.set(i * gapX - 15, 4, j * gapZ - 12)
            shelf.userData = { type: 'Shelf', name: `货架-${i}-${j}` }
            scene.add(shelf)
            shelves.push(shelf)
        }
    }
}

// --------------------- AGV ---------------------
function createAGV() {
    const geo = new THREE.BoxGeometry(2, 1, 3)
    const mat = new THREE.MeshStandardMaterial({ color: 0xff6a00 })
    agv = new THREE.Mesh(geo, mat)
    agv.position.set(-20, 0.5, -15)
    agv.userData = { type: 'AGV', name: 'AGV-01' }
    scene.add(agv)
}

function createAGVPath() {
    // 简单环形巡航路径
    const pts = [
        new THREE.Vector3(-20, 0.5, -15),
        new THREE.Vector3(20, 0.5, -15),
        new THREE.Vector3(20, 0.5, 15),
        new THREE.Vector3(-20, 0.5, 15)
    ]
    agvCurve = new THREE.CatmullRomCurve3(pts, true)

    const pathGeo = new THREE.BufferGeometry().setFromPoints(
        agvCurve.getPoints(100)
    )
    const pathLine = new THREE.Line(
        pathGeo,
        new THREE.LineBasicMaterial({ color: 0xff0000 })
    )
    scene.add(pathLine)
}

function updateAGV() {
    if (!agvRunning.value) return
    agvT += agvSpeed
    if (agvT > 1) agvT = 0
    const pos = agvCurve.getPointAt(agvT)
    const tan = agvCurve.getTangentAt(agvT)

    agv.position.copy(pos)
    const angle = Math.atan2(tan.x, tan.z)
    agv.rotation.y = angle
}

// --------------------- 交互 ---------------------
function onPointer(e: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(scene.children, true)
    if (!hits.length) return

    const obj = hits[0].object as THREE.Mesh
    const ud = obj.userData || {}

    if (ud.type === 'Shelf') {
        device.value = {
            name: ud.name,
            type: '货架',
            status: '运行',
            position: `${obj.position.x.toFixed(1)}, ${obj.position.z.toFixed(1)}`
        }
    }

    if (ud.type === 'AGV') {
        device.value = {
            name: ud.name,
            type: 'AGV',
            status: agvRunning.value ? '运输中' : '待机',
            position: `${agv.position.x.toFixed(1)}, ${agv.position.z.toFixed(1)}`
        }
    }
}

function onTreeClick(node: any) {
    if (node.label.includes('AGV')) {
        device.value = {
            name: 'AGV-01',
            type: 'AGV',
            status: agvRunning.value ? '运输中' : '待机',
            position: `${agv.position.x.toFixed(1)}, ${agv.position.z.toFixed(1)}`
        }
    } else if (node.label.includes('货架')) {
        device.value = {
            name: '货架区',
            type: '货架',
            status: '正常',
            position: '区域'
        }
    }
}

// --------------------- 工具栏 ---------------------
function resetCamera() {
    camera.position.set(40, 40, 40)
    controls.target.set(0, 0, 0)
    controls.update()
}

function toggleGrid() {
    gridVisible.value = !gridVisible.value
    grid.visible = gridVisible.value
}

function toggleAGV() {
    agvRunning.value = !agvRunning.value
}

// --------------------- 渲染循环 ---------------------
let raf = 0
function animate() {
    raf = requestAnimationFrame(animate)
    controls.update()
    updateAGV()
    renderer.render(scene, camera)
}

// --------------------- Resize ---------------------
function onResize() {
    if (!threeEl.value) return
    const w = threeEl.value.clientWidth
    const h = threeEl.value.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
}

// --------------------- 生命周期 ---------------------
onMounted(init)

onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    renderer?.domElement.removeEventListener('pointerdown', onPointer)
    renderer?.dispose()
    scene?.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose?.()
        if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose?.())
            else obj.material.dispose?.()
        }
    })
})
</script>

<style scoped>
.warehouse-root {
    display: flex;
    height: 100%;
    gap: 10px;
}

.panel-left {
    width: 240px;
}

.panel-right {
    width: 260px;
}

.panel-center {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.toolbar {
    height: 40px;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.three {
    flex: 1;
    background: #000;
}

.full {
    height: 100%;
}
</style>