<template>
    <div class="login-container">
        <!-- 动态粒子 Canvas -->
        <canvas ref="particleCanvas" class="particle-canvas"></canvas>

        <el-card class="login-card">
            <h2 class="title">智能仓储数字孪生系统</h2>
            <el-form :model="form">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password />
                </el-form-item>
                <el-button type="primary" class="login-btn" @click="login">
                    登录
                </el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
    username: '',
    password: ''
})

function login() {
    router.push('/')
}

// ---------- 粒子动画（增强版：更多粒子 + 鼠标交互）----------
const particleCanvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrame: number
let particles: Particle[] = []
const particleCount = 500 // 增加到300个粒子

// 鼠标位置（初始设为画布外，避免初始影响）
let mouseX = -1000
let mouseY = -1000

class Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number

    constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.3
    }

    // 更新位置，并加入鼠标排斥效果
    update(canvasWidth: number, canvasHeight: number) {
        // 鼠标排斥逻辑
        const dx = this.x - mouseX
        const dy = this.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repelRadius = 150 // 影响半径
        if (dist < repelRadius && dist > 0) {
            const force = (repelRadius - dist) / repelRadius // 0~1，越近力越大
            const angle = Math.atan2(dy, dx)
            const repelStrength = 1.2 // 排斥强度
            this.speedX += Math.cos(angle) * force * repelStrength
            this.speedY += Math.sin(angle) * force * repelStrength
        }

        // 限制速度范围，防止飞出太快
        const maxSpeed = 1.5
        const spd = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY)
        if (spd > maxSpeed) {
            this.speedX = (this.speedX / spd) * maxSpeed
            this.speedY = (this.speedY / spd) * maxSpeed
        }

        this.x += this.speedX
        this.y += this.speedY

        // 边界重置（穿越效果）
        if (this.x < 0) this.x = canvasWidth
        if (this.x > canvasWidth) this.x = 0
        if (this.y < 0) this.y = canvasHeight
        if (this.y > canvasHeight) this.y = 0
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(100, 200, 255, ${this.opacity})`
        ctx.fill()
    }
}

function initParticles(width: number, height: number) {
    particles = []
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(width, height))
    }
}

function animateParticles() {
    // 确保画布和上下文存在
    if (!ctx || !particleCanvas.value) return

    const canvas = particleCanvas.value
    const context = ctx // 局部常量，类型安全

    context.clearRect(0, 0, canvas.width, canvas.height)

    // 更新所有粒子
    particles.forEach(p => p.update(canvas.width, canvas.height))

    // 绘制粒子
    particles.forEach(p => p.draw(context))

    // 绘制连接线（增加存在性检查）
    context.lineWidth = 0.5
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i]
            const p2 = particles[j]
            // 确保两个粒子都存在（TypeScript 类型保护）
            if (!p1 || !p2) continue

            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 100) {
                context.beginPath()
                context.moveTo(p1.x, p1.y)
                context.lineTo(p2.x, p2.y)
                // 透明度随距离变化，保证在 0~0.1 之间
                const opacity = 0.1 * (1 - distance / 100)
                context.strokeStyle = `rgba(100, 200, 255, ${opacity})`
                context.stroke()
            }
        }
    }

    animationFrame = requestAnimationFrame(animateParticles)
}

// 鼠标事件处理
function handleMouseMove(e: MouseEvent) {
    if (!particleCanvas.value) return
    const rect = particleCanvas.value.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
}

function handleMouseLeave() {
    mouseX = -1000
    mouseY = -1000 // 将鼠标移出画布，停止影响
}

function handleResize() {
    if (!particleCanvas.value) return
    const canvas = particleCanvas.value
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    initParticles(canvas.width, canvas.height)
}

onMounted(() => {
    if (particleCanvas.value) {
        const canvas = particleCanvas.value
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        ctx = canvas.getContext('2d')
        initParticles(canvas.width, canvas.height)
        animateParticles()

        // 监听鼠标事件
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseleave', handleMouseLeave)
        window.addEventListener('resize', handleResize)
    }
})

onUnmounted(() => {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame)
    }
    if (particleCanvas.value) {
        particleCanvas.value.removeEventListener('mousemove', handleMouseMove)
        particleCanvas.value.removeEventListener('mouseleave', handleMouseLeave)
    }
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.login-container {
    position: relative;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(ellipse at bottom, #0d1d31 0%, #0c0d13 100%);
    overflow: hidden;
}

.particle-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    /* 改为 auto 以接收鼠标事件 */
    z-index: 0;
}

.login-card {
    width: 400px;
    background: rgba(10, 25, 45, 0.6) !important;
    backdrop-filter: blur(15px);
    border: 1px solid rgba(0, 255, 255, 0.3) !important;
    border-radius: 20px !important;
    box-shadow:
        0 0 30px rgba(0, 255, 255, 0.3),
        inset 0 0 20px rgba(0, 255, 255, 0.1);
    animation: cardFloat 6s ease-in-out infinite;
    z-index: 1;
}

@keyframes cardFloat {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }
}

.title {
    text-align: center;
    margin-bottom: 30px;
    font-size: 26px;
    font-weight: 600;
    background: linear-gradient(135deg, #00f5ff, #a0f0ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
    letter-spacing: 2px;
}

/* 覆盖 Element Plus 表单样式 */
:deep(.el-form-item__label) {
    color: #b0e0ff !important;
    font-weight: 400;
    text-shadow: 0 0 5px rgba(0, 200, 255, 0.3);
}

:deep(.el-input__wrapper) {
    background: rgba(30, 50, 70, 0.4) !important;
    border: 1px solid rgba(0, 255, 255, 0.3) !important;
    border-radius: 12px !important;
    box-shadow: none !important;
    transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
    border-color: #00f5ff !important;
    box-shadow: 0 0 15px rgba(0, 245, 255, 0.3) !important;
}

:deep(.el-input__wrapper.is-focus) {
    border-color: #00f5ff !important;
    box-shadow: 0 0 20px rgba(0, 245, 255, 0.5) !important;
}

:deep(.el-input__inner) {
    color: #ffffff !important;
    font-weight: 400;
}

/* 登录按钮 */
.login-btn {
    width: 100%;
    margin-top: 20px;
    background: linear-gradient(135deg, #00c6ff, #0072ff) !important;
    border: none !important;
    border-radius: 12px !important;
    height: 48px;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 2px;
    color: white;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    box-shadow: 0 0 20px rgba(0, 198, 255, 0.6);
    transition: all 0.3s ease;
}

.login-btn:hover {
    transform: scale(1.02);
    background: linear-gradient(135deg, #00b0f0, #0060d0) !important;
    box-shadow: 0 0 30px rgba(0, 198, 255, 0.9);
}

/* 响应式调整 */
@media (max-width: 480px) {
    .login-card {
        width: 90%;
        margin: 0 20px;
    }

    .title {
        font-size: 22px;
    }
}
</style>