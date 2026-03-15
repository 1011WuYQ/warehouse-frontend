import * as THREE from 'three'

export default class WarehouseBuilder {
    scene: THREE.Scene;
  
    constructor(scene: THREE.Scene) {
      this.scene = scene;
    }
  
    createShelves() {
      const shelves: THREE.Mesh[] = [];
      const geo = new THREE.BoxGeometry(1, 3, 4);
  
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 8; j++) {
          const mat = new THREE.MeshStandardMaterial({
            color: 0x1565c0
          });
  
          const shelf = new THREE.Mesh(geo, mat);
  
          shelf.position.set(
            -20 + i * 4,
            1.5,
            -15 + j * 5
          );
  
          this.scene.add(shelf);
          shelves.push(shelf);
        }
      }
  
      return shelves;
    }
  }