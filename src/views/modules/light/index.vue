<template>
    <div id="container" style="width: 100%;height: 100%">
        <div class="wrapper-select">
            <el-select v-model="value" placeholder="请选择" style="width: 240px"
                       @change="changeLight">
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
import { LightUtil } from '@/utils/lightUtil'
import { OrbitControls } from '@/plugins/three-js/OrbitControls'
import initSceneMixin from '@/mixin/initSceneMixin'
export default {
    name: 'index',
    mixins: [initSceneMixin],
    data () {
        return {
            controls: {},
            value: 0,
            options: Object.freeze([
                {
                    value: 0,
                    label: 'SpotLight（聚光灯）'
                }, {
                    value: 1,
                    label: 'PointLight（点光源）'
                }, {
                    value: 2,
                    label: 'AmbientLight（均匀光）'
                }, {
                    value: 3,
                    label: 'RectAreaLight（平面光）'
                }, {
                    value: 4,
                    label: 'DirectionalLight（平行光）'
                }, {
                    value: 5,
                    label: 'HemisphereLight（半球光）'
                }
            ])
        }
    },
    methods: {
        addSomethingToScene () {
            this.webGLRenderer.shadowMap.enabled = true
            this.webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap
            this.displaySpotLight()
        },
        changeLight (value) {
            this.disposeAll()
            switch (value) {
            case 0:
                this.displaySpotLight()
                break
            case 1:
                this.displayPointLight()
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
                break
            }
        },
        displaySpotLight () {
            this.threeCamera.position.set(65, 8, -10)
            this.threeCamera.updateProjectionMatrix()

            this.controls = new OrbitControls(this.threeCamera, this.webGLRenderer.domElement)

            document.getElementById('container').appendChild(this.webGLRenderer.domElement)

            const lightUtil = new LightUtil(this.threeScene, this.threeCamera)
            lightUtil.createSpotLightHandle()

            let render = () => {
                lightUtil.lightHelper.update()
                lightUtil.shadowCameraHelper.update()
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            render()
            this.controls.addEventListener('change', render)
        },
        displayPointLight () {
            this.threeCamera.position.set(0, 15, 150)
            this.threeCamera.lookAt(0, 0, 0)
            this.threeScene.background = new THREE.Color(0x040306)
            this.threeScene.fog = new THREE.Fog(0x040306, 10, 300)
            const lightUtil = new LightUtil(this.threeScene, this.threeCamera)
            lightUtil.createPointLightHandle()
            let pointLightArray = []
            this.threeScene.children.forEach(item => {
                if (item.type === 'PointLight') {
                    pointLightArray.push(item)
                }
            })

            let render = () => {
                let time = Date.now() * 0.00025
                pointLightArray.forEach(item => {
                    item.position.x = Math.sin(time * 0.7) * 150
                    item.position.z = Math.cos(time * 0.3) * 150
                })
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            render()
        },
        disposeAll () {
            if (Object.keys(this.controls).length > 0) {
                this.controls.dispose()
            }
            this.threeScene.dispose()
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
