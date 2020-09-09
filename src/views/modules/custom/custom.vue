<template>
    <div id="container" style="width: 100%;height: 100%"></div>
</template>

<script>
import * as THREE from 'three'
import initSceneMixin from '@/mixin/initSceneMixin'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
      raycaster: new THREE.Raycaster(),
      btnValue: '关闭动画'
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.getElementById('container').addEventListener('click', this.onMouseClick, false)
    })
  },

  methods: {
    addSomethingToScene () {
      document.getElementById('container').appendChild(this.webGLRenderer.domElement)
      const dataArray = [
        [
          0,
          0
        ],
        [
          -13.35833889618516,
          2.4701580554246902
        ],
        [
          -101.96865356713533,
          77.15640374645591
        ],
        [
          -190.46764875017107,
          155.1852413546294
        ],
        [
          -197.2581376861781,
          163.0317505961284
        ],
        [
          -201.37695884518325,
          170.73296014312655
        ],
        [
          -203.71466815285385,
          184.1011116616428
        ],
        [
          -199.1505690291524,
          194.27254335675389
        ],
        [
          33.50716672837734,
          446.3820748561993
        ],
        [
          48.09002002328634,
          454.66474450100213
        ],
        [
          71.35579359717667,
          459.89590783789754
        ],
        [
          123.11935681477189,
          466.1442454410717
        ],
        [
          148.94547868147492,
          466.4348658891395
        ],
        [
          166.31131924316287,
          462.07556004356593
        ],
        [
          291.54574638418853,
          356.580942501314
        ],
        [
          295.2192895822227,
          342.1953997258097
        ],
        [
          295.55324805527925,
          327.08333684969693
        ],
        [
          288.9853980988264,
          311.97129698563367
        ],
        [
          201.59959782473743,
          206.47827515006065
        ],
        [
          27.27327524125576,
          11.624278566800058
        ],
        [
          9.016878753900528,
          0.290606795810163
        ]
      ]
      const shape = new THREE.Shape()

      shape.moveTo(...dataArray[0])
      for (let i = 1; i < dataArray.length; i++) {
        shape.lineTo(...dataArray[i])
      }
      shape.lineTo(...dataArray[0])
      const extrudeSettings = {
        depth: 160,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1
      }

      const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      extrudeGeometry.center()
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      this.mesh = new THREE.Mesh(extrudeGeometry, material)
      this.threeScene.add(this.mesh)

      const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
      const animate = () => {
        requestAnimationFrame(animate)
        this.webGLRenderer.render(this.threeScene, this.threeCamera)
      }
      animate()
      /**
             * OrbitControls( object : Camera, domElement : HTMLDOMElement )
             * object: （必须）将要被控制的相机。该相机不允许是其他任何对象的子级，除非该对象是场景自身。
             * domElement: （可选）用于事件监听的HTML元素，其默认值为整个文档， 但是如果你只希望在特定的元素上（例如Canvas上）进行控制，在这里进行指定即可。
             * @type {OrbitControls}
             */
      this.controls = new OrbitControls(this.threeCamera, this.webGLRenderer.domElement)
    },

    onMouseClick (event) {
      event.preventDefault()
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1
      this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1
      // 通过摄像机和鼠标位置更新射线
      this.raycaster.setFromCamera(this.mouseVector, this.threeCamera)
      let intersects = this.raycaster.intersectObjects(this.threeScene.children)
      if (intersects.length > 0) {
        intersects[0].object.material.color.set(0xff0000)
      } else {
        this.mesh.material.color.set(0xffffff)
      }
    }
  }
}
</script>

<style scoped>

</style>
