<template>
  <div id="container" style="width: 100%;height: 100%;"></div>
</template>

<script>
import * as THREE from 'three'
import initSceneMixin from '@/mixin/initSceneMixin'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import FeatureCollection from '../../../../public/json/china.json'

export default {
  name: 'custom',
  mixins: [initSceneMixin],
  data () {
    return {
      mesh: {},
      geometry: {},
      controls: {},
      animateId: 0,
      mouseVector: new THREE.Vector2(),
      raycaster: new THREE.Raycaster()
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.getElementById('container').addEventListener('click', this.onMouseClick, false)
    })
  },

  beforeDestroy () {
    document.getElementById('container').removeEventListener('click', this.onMouseClick, false)
  },

  methods: {
    addSomethingToScene () {
      document.getElementById('container').appendChild(this.webGLRenderer.domElement)

      this.buildAuxHandle()

      this.threeCamera.position.set(0, 70, 90)
      this.threeCamera.lookAt(0, 0, 0)
      this.threeScene.background = new THREE.Color(0xf0f0f0)

      // 实现参考地址：https://juejin.im/post/6844904054896885768#commentjue
      const provinceMaterial = new THREE.MeshBasicMaterial({ color: '#d13a34', transparent: true, opacity: 0.6 })
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
      const extrudeSettings = {
        depth: 4,
        bevelEnabled: false
      }
      FeatureCollection.features.forEach(features => {
        const province3D = new THREE.Object3D()
        features.geometry.coordinates.forEach(multiPolygon => {
          multiPolygon.forEach(coordinates => {
            const shape = new THREE.Shape()
            const linGeometry = new THREE.Geometry()
            coordinates.forEach((coordinate, index) => {
              if (index === 0) {
                shape.moveTo(coordinate[0], coordinate[1])
              }
              shape.lineTo(coordinate[0], coordinate[1])
              linGeometry.vertices.push(new THREE.Vector3(coordinate[0], coordinate[1], 4.01))
            })
            const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
            const provinceMesh = new THREE.Mesh(extrudeGeometry, provinceMaterial)
            const provinceLine = new THREE.Line(linGeometry, lineMaterial)
            province3D.add(provinceMesh)
            province3D.add(provinceLine)
          })
        })
        // province3D.properties = features.properties
        this.threeScene.add(province3D)
      })

      this.webGLRenderer.render(this.threeScene, this.threeCamera)

      const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
      const animate = () => {
        this.webGLRenderer.clear()
        requestAnimationFrame(animate)
        this.webGLRenderer.render(this.threeScene, this.threeCamera)
      }
      animate()
    },

    buildAuxHandle () {
      let axisHelper = new THREE.AxesHelper(2000)
      this.threeScene.add(axisHelper)
      let gridHelper = new THREE.GridHelper(600, 60)
      this.threeScene.add(gridHelper)

      /**
       * OrbitControls( object : Camera, domElement : HTMLDOMElement )
       * object: （必须）将要被控制的相机。该相机不允许是其他任何对象的子级，除非该对象是场景自身。
       * domElement: （可选）用于事件监听的HTML元素，其默认值为整个文档， 但是如果你只希望在特定的元素上（例如Canvas上）进行控制，在这里进行指定即可。
       * @type {OrbitControls}
       */
      this.controls = new OrbitControls(this.threeCamera, this.webGLRenderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.25
      this.controls.rotateSpeed = 0.35
    },

    showNameHandle () {

    }
  }
}
</script>

<style scoped>

</style>
