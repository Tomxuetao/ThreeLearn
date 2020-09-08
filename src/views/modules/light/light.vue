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
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { StereoEffect } from 'three/examples/jsm/effects/StereoEffect'
import initSceneMixin from '@/mixin/initSceneMixin'
export default {
  name: 'light',
  mixins: [initSceneMixin],
  data () {
    return {
      controls: {},
      value: 0,
      animateId: 0,
      mouse: {
        mouseX: 0,
        mouseY: 0
      },
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
        this.displayAmbientLight()
        break
      case 3:
        this.displayRectAreaLight()
        break
      case 4:
        this.displayDirectionalLight()
        break
      case 5:
        this.displayHemisphereLight()
        break
      }
    },

    displaySpotLight () {
      this.threeScene.background = new THREE.Color(0x000000)
      this.threeScene.fog = null

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
      this.threeScene.background = new THREE.Color(0x040306)
      this.threeScene.fog = new THREE.Fog(0x040306, 10, 300)

      this.threeCamera.position.set(0, 15, 150)
      this.threeCamera.lookAt(0, 0, 0)

      // controls
      let lock = new THREE.Clock()
      this.controls = new TrackballControls(this.threeCamera, this.webGLRenderer.domElement)
      this.controls.rotateSpeed = 1.0
      this.controls.zoomSpeed = 1.2
      this.controls.panSpeed = 0.8
      this.controls.noZoom = false
      this.controls.noPan = false
      this.controls.staticMoving = false
      this.controls.dynamicDampingFactor = 0.15
      this.controls.keys = [65, 83, 68]

      const lightUtil = new LightUtil(this.threeScene, this.threeCamera)
      lightUtil.createPointLightHandle()
      let pointLightArray = []
      pointLightArray = this.threeScene.children.filter(item => item.type === 'PointLight')

      let render = () => {
        let time = Date.now() * 0.00025
        pointLightArray.forEach(item => {
          item.position.x = Math.sin(time * 0.7) * 150
          item.position.z = Math.cos(time * 0.3) * 150
        })
        this.controls.update(lock.getDelta())
        this.webGLRenderer.render(this.threeScene, this.threeCamera)
      }
      let animateHandle = () => {
        this.animateId = requestAnimationFrame(animateHandle)
        render()
      }
      animateHandle()
    },

    displayAmbientLight () {
      this.threeScene.background = new THREE.Color(0xcce0ff)
      this.threeScene.fog = new THREE.Fog(0xcce0ff, 500, 10000)
      this.threeCamera.position.set(1000, 50, 1500)

      const lightUtil = new LightUtil(this.threeScene, this.threeCamera)
      lightUtil.createAmbientLightHandle()
      this.webGLRenderer.render(this.threeScene, this.threeCamera)
    },

    displayRectAreaLight () {
      this.threeCamera.position.set(0, 20, 35)

      const lightUtil = new LightUtil(this.threeScene, this.threeCamera)
      let rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10)
      lightUtil.createRectAreaLightHandle(rectLight)

      this.controls = new OrbitControls(this.threeCamera, this.webGLRenderer.domElement)
      this.controls.update()

      let origin = new THREE.Vector3()

      let animateHandle = () => {
        this.animateId = requestAnimationFrame(animateHandle)
        let time = Date.now() / 2000
        rectLight.position.set(15.0 * Math.cos(time), 5.0 + 5.0 * Math.sin(time / 3.0), 15.0 * Math.sin(time))
        rectLight.lookAt(origin)
        this.webGLRenderer.render(this.threeScene, this.threeCamera)
      }
      animateHandle()
    },

    displayDirectionalLight () {
      this.threeCamera.position.z = 3200

      const lightUtil = new LightUtil(this.threeScene, this.threeCamera)
      let sphereArray = []
      lightUtil.createDirectionalLightHandle(sphereArray)

      let effect = new StereoEffect(this.webGLRenderer)
      effect.setSize(this.canvasWidth, this.documentClientHeight - this.wrapperHeight)

      let animateHandle = () => {
        this.animateId = requestAnimationFrame(animateHandle)
        let timer = 0.0001 * Date.now()

        this.threeCamera.position.x += (this.mouse.mouseX - this.threeCamera.position.x) * 0.05
        this.threeCamera.position.y += (-this.mouse.mouseY - this.threeCamera.position.y) * 0.05
        this.threeCamera.lookAt(this.threeScene.position)

        for (let i = 0, il = sphereArray.length; i < il; i++) {
          let sphere = sphereArray[i]
          sphere.position.x = 5000 * Math.cos(timer + i)
          sphere.position.y = 5000 * Math.sin(timer + i * 1.1)
        }
        effect.render(this.threeScene, this.threeCamera)
      }
      animateHandle()
    },

    displayHemisphereLight () {
      this.threeCamera.position.set(30, 30, 100)

      const lightUtil = new LightUtil(this.threeScene, this.threeCamera)
      let light = new THREE.DirectionalLight(0xffffff, 0.8)
      lightUtil.createHemisphereLightHandle(light, this.webGLRenderer)

      this.controls = new OrbitControls(this.threeCamera, this.webGLRenderer.domElement)
      this.controls.maxPolarAngle = Math.PI * 0.495
      this.controls.target.set(0, 10, 0)
      this.controls.minDistance = 40.0
      this.controls.maxDistance = 200.0
      this.controls.update()

      let animateHandle = () => {
        this.animateId = requestAnimationFrame(animateHandle)
        let time = performance.now() * 0.001

        lightUtil.sphere.position.y = Math.sin(time) * 20 + 5
        lightUtil.sphere.rotation.x = time * 0.5
        lightUtil.sphere.rotation.z = time * 0.51

        lightUtil.water.material.uniforms['time'].value += 1.0 / 60.0

        this.webGLRenderer.render(this.threeScene, this.threeCamera)
      }
      animateHandle()
    },

    disposeAll () {
      this.webGLRenderer.setViewport(0, 0, this.canvasWidth, this.documentClientHeight - this.wrapperHeight)
      if (this.animateId) {
        cancelAnimationFrame(this.animateId)
        this.animateId = 0
      }
      if (Object.keys(this.controls).length > 0) {
        this.controls.dispose()
        this.controls = {}
      }
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
