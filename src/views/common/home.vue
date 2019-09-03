<template>
    <div id="container" style="width: 100%;height: 100%">
<!--        <canvas id="canvas" style="width: 100%;height: 100%"></canvas>-->
    </div>
</template>

<script>
import * as THREE from 'three'
export default {
    mounted () {
        this.$nextTick(() => {
            this.initScene()
        })
    },
    methods: {
        initScene () {
            let scene = new THREE.Scene()
            let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
            let renderer = new THREE.WebGLRenderer({
                antialias: true
            })
            renderer.setSize(1618, 820)
            document.getElementById('container').appendChild(renderer.domElement)
            let geometry = new THREE.BoxGeometry(1, 1, 1)
            let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            let cube = new THREE.Mesh(geometry, material)
            scene.add(cube)
            camera.position.z = 5
            let animate = () => {
                requestAnimationFrame(animate)
                cube.rotation.x += 0.01
                cube.rotation.y += 0.01
                renderer.render(scene, camera)
            }
            animate()
        }
    }
}
</script>
