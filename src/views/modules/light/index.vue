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
// import * as THREE from 'three'
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
            ]),
            lightUtil: {}
        }
    },
    methods: {
        addSomethingToScene () {
            this.controls = new OrbitControls(this.threeCamera, this.webGLRenderer.domElement)
            document.getElementById('container').appendChild(this.webGLRenderer.domElement)
            this.threeCamera.position.set(65, 8, -10)
            this.threeCamera.fov = 35
            this.threeCamera.far = 1000
            this.threeCamera.updateProjectionMatrix()
            this.lightUtil = new LightUtil(this.threeScene, this.threeCamera)
            this.lightUtil.createSpotLightHandle()
            let render = () => {
                this.lightUtil.lightHelper.update()
                this.lightUtil.cameraHelper.update()
                this.webGLRenderer.render(this.threeScene, this.threeCamera)
            }
            render()
            this.controls.addEventListener('change', render)
        },
        changeLight (value) {
        },
        createSpotLightHandle () {
        },
        createPointLightHandle () {
        },
        createAmbientLightHandle () {
        },
        createRectAreaLightHandle () {
        },
        createDirectionalLightHandle () {
        },
        createHemisphereLightHandle () {
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
