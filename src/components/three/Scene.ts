import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function createScene(container:HTMLElement){

const scene=new THREE.Scene()

scene.background=new THREE.Color(0x1b1f29)

const camera=new THREE.PerspectiveCamera(
60,
window.innerWidth/window.innerHeight,
0.1,
1000
)

camera.position.set(30,25,30)

const renderer=new THREE.WebGLRenderer({antialias:true})

renderer.setSize(window.innerWidth,window.innerHeight)

container.appendChild(renderer.domElement)

const controls=new OrbitControls(camera,renderer.domElement)

const grid=new THREE.GridHelper(60,60)

scene.add(grid)

const ambient=new THREE.AmbientLight(0xffffff,0.6)

scene.add(ambient)

const light=new THREE.DirectionalLight(0xffffff,1)

light.position.set(20,40,10)

scene.add(light)

return{
scene,
camera,
renderer,
controls
}

}