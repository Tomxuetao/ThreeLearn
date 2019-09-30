<template>
    <div id="container" style="width: 100%;height: 100%">
        <div class="wrapper-select">
            <el-select v-model="value" placeholder="请选择" style="width: 240px" @change="changeHelper">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three'
import { HelperUtil } from '@/utils/helperUtil'
import initSceneMixin from '@/mixin/initSceneMixin'
export default {
    name: 'helper',
    mixins: [initSceneMixin],
    data () {
        return {
            value: 0,
            animateId: 0,
            controls: {},
            options: [
                {
                    value: 0,
                    label: 'BoxHelper'
                }, {
                    value: 1,
                    label: 'GridHelper'
                }, {
                    value: 2,
                    label: 'AxesHelper'
                }, {
                    value: 3,
                    label: 'Box3Helper'
                }, {
                    value: 4,
                    label: 'ArrowHelper'
                }, {
                    value: 5,
                    label: 'PlaneHelper'
                }, {
                    value: 6,
                    label: 'CameraHelper'
                }, {
                    value: 7,
                    label: 'SkeletonHelper'
                }, {
                    value: 8,
                    label: 'SpotLightHelper'
                }, {
                    value: 9,
                    label: 'PolarGridHelper'
                }, {
                    value: 10,
                    label: 'PointLightHelper'
                }, {
                    value: 11,
                    label: 'FaceNormalsHelper'
                }, {
                    value: 12,
                    label: 'RectAreaLightHelper'
                }, {
                    value: 13,
                    label: 'VertexNormalsHelper'
                }, {
                    value: 14,
                    label: 'PositionalAudioHelper'
                }, {
                    value: 15,
                    label: 'DirectionalLightHelper'
                }, {
                    value: 16,
                    label: 'HemisphereLightHelper'
                }
            ]
        }
    },

    methods: {
        addSomethingToScene () {
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
        },

        changeHelper (value) {
            this.disposeAll()
            switch (value) {
            case 0:
                break
            case 1:
                break
            case 2:
                break
            case 3:
                break
            case 4:
                break
            case 5:
                break
            case 6:
                this.createCameraHelperHandle()
                break
            case 7:
                break
            case 8:
                break
            case 9:
                break
            case 10:
                break
            case 11:
                break
            case 12:
                break
            }
        },

        createCameraHelperHandle () {
            const helperUtil = new HelperUtil(this.threeScene, this.threeCamera)
            helperUtil.cameraHelper()

            this.threeCamera.position.z = 3000

            let mesh = {}
            let perspectiveCamera = {}
            let cameraRig = {}

            let animateHandle = () => {
                let r = Date.now() * 0.0005
                this.animateId = requestAnimationFrame(animateHandle)
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
                if (this.threeScene.children.length > 0 && Object.keys(mesh).length === 0) {
                    let meshArray = this.threeScene.children.filter(item => item.type === 'Mesh')
                    if (meshArray.length > 0) {
                        mesh = meshArray[0]
                    }
                    let groupArray = this.threeScene.children.filter(item => item.type === 'Group')

                    if (groupArray.length > 0) {
                        cameraRig = groupArray[0]
                        if (cameraRig.children.length > 0) {
                            let cameraArray = cameraRig.children.filter(item => item.type === 'PerspectiveCamera')
                            perspectiveCamera = cameraArray[0]
                        }
                    }
                }
                if (Object.keys(mesh).length > 0 && Object.keys(perspectiveCamera).length > 0 && Object.keys(cameraRig).length > 0) {
                    mesh.position.x = 700 * Math.cos(r)
                    mesh.position.z = 700 * Math.sin(r)
                    mesh.position.y = 700 * Math.sin(r)
                    mesh.children[0].position.x = 70 * Math.cos(2 * r)
                    mesh.children[0].position.z = 70 * Math.sin(r)
                    perspectiveCamera.fov = 35 + 30 * Math.sin(0.5 * r)
                    perspectiveCamera.far = mesh.position.length()
                    cameraRig.lookAt(mesh.position)
                }
            }
            animateHandle()
        },
        createCameraHelperScene (aspect) {
            let perspectiveCamera = new THREE.PerspectiveCamera(50, aspect, 150, 1000)

            this.cameraHelper = new THREE.CameraHelper(perspectiveCamera)
            this.threeScene.add(this.cameraHelper)

            perspectiveCamera.rotation.y = Math.PI
            this.cameraRig = new THREE.Group()
            this.cameraRig.add(perspectiveCamera)
            this.threeScene.add(this.cameraRig)
            this.createMeshHandle()
            const animateHandle = () => {
                this.animateId = requestAnimationFrame(animateHandle)
                let r = Date.now() * 0.0005
                this.mesh.position.x = 700 * Math.cos(r)
                this.mesh.position.z = 700 * Math.sin(r)
                this.mesh.position.y = 700 * Math.sin(r)
                this.mesh.children[0].position.x = 70 * Math.cos(2 * r)
                this.mesh.children[0].position.z = 70 * Math.sin(r)
                perspectiveCamera.fov = 35 + 30 * Math.sin(0.5 * r)
                perspectiveCamera.far = this.mesh.position.length()
                this.cameraRig.lookAt(this.mesh.position)
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            animateHandle()()
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

        disposeAll () {
            this.threeScene.background = new THREE.Color(0x000000)
            this.threeScene.position.set(0, 0, 0)
            this.threeCamera.position.set(0, 0, 0)
            if (this.animateId) {
                cancelAnimationFrame(this.animateId)
                this.animateId = 0
            }
            if (Object.keys(this.controls).length > 0) {
                this.controls.dispose()
                this.controls = {}
            }
            this.threeScene.dispose()
            this.webGLRenderer.clear()
            this.webGLRenderer.clearDepth()
            this.webGLRenderer.dispose()
            // 清空场景
            this.threeScene.children = []
        }
    }
}
</script>

<style scoped>
    .wrapper-select {
        display: flex;
        position: absolute;
        top: 35px;
        right: 50px;
    }
</style>
