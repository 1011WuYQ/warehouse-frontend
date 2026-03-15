import * as THREE from 'three'

export default class AGVAnimation {

scene: THREE.Scene
agv!: THREE.Mesh

constructor(scene: THREE.Scene){

this.scene = scene

this.createAGV()

}

createAGV(){

const geometry = new THREE.BoxGeometry(1,0.5,1)

const material = new THREE.MeshStandardMaterial({
color:0xff0000
})

this.agv = new THREE.Mesh(geometry,material)

this.scene.add(this.agv)

this.move()

}

move(){

let t = 0

setInterval(()=>{

this.agv.position.x = Math.sin(t)*10
this.agv.position.z = Math.cos(t)*10

t += 0.05

},16)

}

}