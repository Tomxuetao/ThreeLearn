<template>
    <div id="container" style="width: 100%;height: 100%">
        <div class="wrapper-select">
            <el-select v-model="value" placeholder="请选择" style="width: 240px" @change="changeLoader">
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
import { OrbitControls } from '@/plugins/three-js/controls/OrbitControls'
import { LoaderUtil } from '@/utils/loaderUtil'
import initSceneMixin from '@/mixin/initSceneMixin'

export default {
    name: 'loader',
    mixins: [initSceneMixin],
    data () {
        return {
            controls: {},
            value: 0,
            animateId: 0,
            oceanAmbientSound: {},
            options: [
                {
                    value: 0,
                    label: 'FileLoader'
                }, {
                    value: 1,
                    label: 'FontLoader'
                }, {
                    value: 2,
                    label: 'ImageLoader'
                }, {
                    value: 3,
                    label: 'AudioLoader'
                }, {
                    value: 4,
                    label: 'ObjectLoader'
                }, {
                    value: 5,
                    label: 'TextureLoader'
                }, {
                    value: 6,
                    label: 'MaterialLoader'
                }, {
                    value: 7,
                    label: 'AnimationLoader'
                }, {
                    value: 8,
                    label: 'DataTextureLoader'
                }, {
                    value: 9,
                    label: 'ImageBitmapLoader'
                }, {
                    value: 10,
                    label: 'CubeTextureLoader'
                }, {
                    value: 11,
                    label: 'BufferGeometryLoader'
                }, {
                    value: 12,
                    label: 'CompressedTextureLoader'
                }
            ]
        }
    },

    methods: {
        addSomethingToScene () {
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
        },

        changeLoader (value) {
            this.disposeAll()
            switch (value) {
            case 0:
                THREE.Cache.enabled = true
                break
            case 1:
                this.createFontHandle()
                break
            case 2:
                this.createImageHandle()
                break
            case 3:
                this.createAudioHandle()
                break
            case 4:
                this.createObjectHandle()
                break
            case 5:
                this.createTextureHandle()
                break
            case 6:
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

        createFontHandle () {
            this.threeScene.background = new THREE.Color(0xf0f0f0)

            this.threeCamera.position.set(0, -50, 600)

            const loaderUtil = new LoaderUtil(this.threeScene)
            loaderUtil.loaderFont()

            this.controls = new OrbitControls(this.threeCamera, this.webGLRenderer.domElement)
            this.controls.target.set(0, 0, 0)
            this.controls.update()

            let animateHandle = () => {
                this.animateId = requestAnimationFrame(animateHandle)
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            animateHandle()
        },

        createImageHandle () {
            this.threeCamera.position.z = 250

            let ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
            this.threeScene.add(ambientLight)

            let pointLight = new THREE.PointLight(0xffffff, 0.8)
            this.threeCamera.add(pointLight)

            const loaderUtil = new LoaderUtil(this.threeScene)
            loaderUtil.loaderImage()

            let animateHandle = () => {
                this.animateId = requestAnimationFrame(animateHandle)
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            animateHandle()
        },

        createAudioHandle () {
            // 初始化一个监听
            let audioListener = new THREE.AudioListener()
            this.threeCamera.add(audioListener)

            this.oceanAmbientSound = new THREE.Audio(audioListener)
            this.threeScene.add(this.oceanAmbientSound)

            const loaderUtil = new LoaderUtil(this.threeScene)
            loaderUtil.loaderAudio(this.oceanAmbientSound)

            let animateHandle = () => {
                this.animateId = requestAnimationFrame(animateHandle)
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            animateHandle()
        },

        createObjectHandle () {
            this.threeCamera.position.z = 10

            const loaderUtil = new LoaderUtil(this.threeScene)
            loaderUtil.loaderObject()

            let animateHandle = () => {
                this.animateId = requestAnimationFrame(animateHandle)
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            animateHandle()
        },

        createTextureHandle () {
            this.threeCamera.position.z = 800

            const loaderUtil = new LoaderUtil(this.threeScene)
            loaderUtil.loaderTexture()

            let mesh = {}
            let animateHandle = () => {
                this.animateId = requestAnimationFrame(animateHandle)
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
                if (this.threeScene.children.length > 0 && Object.keys(mesh).length === 0) {
                    mesh = this.threeScene.children[0]
                }
                if (Object.keys(mesh).length > 0) {
                    mesh.rotation.x += 0.005
                    mesh.rotation.y += 0.01
                }
            }
            animateHandle()
        },

        disposeAll () {
            if (Object.keys(this.oceanAmbientSound).length > 0) {
                this.oceanAmbientSound.stop()
            }
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
