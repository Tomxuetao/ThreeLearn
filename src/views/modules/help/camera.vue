<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>
import * as THREE from 'three'
import initSceneMixin from '@/mixin/initSceneMixin'

export default {
    name: 'camera',
    mixins: [initSceneMixin],
    data () {
        return {
            perspectiveCamera: {},
            cameraHelper: {},
            cameraRig: {},
            mesh: {}
        }
    },
    created () {
    },
    methods: {
        addSomethingToScene () {
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
            let aspect = this.threeCamera.aspect
            this.createCameraHelperScene(aspect)
        },
        createCameraHelperScene (aspect) {
            this.perspectiveCamera = new THREE.PerspectiveCamera(50, aspect, 150, 1000)
            this.cameraHelper = new THREE.CameraHelper(this.perspectiveCamera)
            this.threeScene.add(this.cameraHelper)
            this.perspectiveCamera.rotation.y = Math.PI
            this.cameraRig = new THREE.Group()
            this.cameraRig.add(this.perspectiveCamera)
            this.threeScene.add(this.cameraRig)
            this.createMeshHandle()
            this.animateHandle()
        },
        createMeshHandle () {
            this.mesh = new THREE.Mesh(
                new THREE.SphereBufferGeometry(100, 16, 8),
                new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
            )
            this.threeScene.add(this.mesh)
            let mesh2 = new THREE.Mesh(
                new THREE.SphereBufferGeometry(50, 16, 8),
                new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
            )
            mesh2.position.y = 150
            this.mesh.add(mesh2)
            let mesh3 = new THREE.Mesh(
                new THREE.SphereBufferGeometry(5, 16, 8),
                new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
            )
            mesh3.position.z = 150
            this.cameraRig.add(mesh3)
            /**
             * 构建背景（点信息）
             */
            let geometry = new THREE.BufferGeometry()
            let vertices = []
            for (let i = 0; i < 10000; i++) {
                vertices.push(THREE.Math.randFloatSpread(2000))
                vertices.push(THREE.Math.randFloatSpread(2000))
                vertices.push(THREE.Math.randFloatSpread(2000))
            }
            geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
            let particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }))
            this.threeScene.add(particles)
        },
        animateHandle () {
            const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
            const animate = () => {
                requestAnimationFrame(animate)
                let r = Date.now() * 0.0005
                this.mesh.position.x = 700 * Math.cos(r)
                this.mesh.position.z = 700 * Math.sin(r)
                this.mesh.position.y = 700 * Math.sin(r)
                this.mesh.children[0].position.x = 70 * Math.cos(2 * r)
                this.mesh.children[0].position.z = 70 * Math.sin(r)
                this.perspectiveCamera.fov = 35 + 30 * Math.sin(0.5 * r)
                this.perspectiveCamera.far = this.mesh.position.length()
                this.perspectiveCamera.updateProjectionMatrix()
                this.cameraHelper.update()
                this.cameraHelper.visible = true
                this.cameraRig.lookAt(this.mesh.position)
                this.webGLRenderer.clear()
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            animate()
        }
    }
}
</script>
