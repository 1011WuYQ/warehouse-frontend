import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import WarehouseBuilder from './WarehouseBuilder'

export default class SceneManager {

container: HTMLDivElement
scene: THREE.Scene
camera: THREE.PerspectiveCamera
renderer: THREE.WebGLRenderer
controls!: OrbitControls

constructor(container: HTMLDivElement){

this.container = container

this.scene = new THREE.Scene()

this.camera = new THREE.PerspectiveCamera(
75,
container.clientWidth / container.clientHeight,
0.1,
1000
)

this.renderer = new THREE.WebGLRenderer({
antialias:true
})

this.init()

}

init(){

this.renderer.setSize(
this.container.clientWidth,
this.container.clientHeight
)

this.container.appendChild(this.renderer.domElement)

this.camera.position.set(30,30,30)

this.controls = new OrbitControls(
this.camera,
this.renderer.domElement
)

this.addLight()

new WarehouseBuilder(this.scene)

this.animate()

}

addLight(){

const light = new THREE.DirectionalLight(0xffffff,1)

light.position.set(10,20,10)

this.scene.add(light)

}

animate(){

requestAnimationFrame(()=>this.animate())

this.renderer.render(this.scene,this.camera)

}

}