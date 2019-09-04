<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>
import * as THREE from 'three'
import documentClientMixin from '@/mixin/documentClientMixin'
export default {
    data () {
        return {
            webGLRenderer: {},
            camera: {}
        }
    },
    mixins: [documentClientMixin],
    mounted () {
        this.$nextTick(() => {
            this.initScene(this.documentClientWidth - 302, this.documentClientHeight - 125)
        })
    },
    methods: {
        initScene (width, height) {
            let scene = new THREE.Scene()
            this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
            this.webGLRenderer = new THREE.WebGLRenderer({
                antialias: true
            })
            this.webGLRenderer.setSize(width, height)
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
            let geometry = new THREE.BoxGeometry(1, 1, 1)
            let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
            let cubeMesh = new THREE.Mesh(geometry, material)
            scene.add(cubeMesh)
            this.camera.position.z = 5
            const animate = () => {
                requestAnimationFrame(animate)
                cubeMesh.rotation.x += 0.01
                cubeMesh.rotation.y += 0.01
                this.webGLRenderer.render(scene, this.camera)
            }
            animate()
        }
    }
}
</script>
