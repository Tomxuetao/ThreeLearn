<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>
import * as THREE from 'three'
import initSceneMixin from '@/mixin/initSceneMixin'
export default {
    mixins: [initSceneMixin],
    methods: {
        addSomethingToScene () {
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
            let geometry = new THREE.BoxBufferGeometry(1, 1, 1)
            let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            let mesh = new THREE.Mesh(geometry, material)
            this.threeScene.add(mesh)
            this.threeCamera.position.z = 10
            const animate = () => {
                requestAnimationFrame(animate)
                mesh.rotation.x += 0.01
                mesh.rotation.y += 0.01
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            animate()
        }
    }
}
</script>
