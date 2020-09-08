<template>
    <div id="container" style="width: 100%;height: 100%">
        <div class="wrapper-select">
            <el-select v-model="value" placeholder="请选择" style="width: 240px"
                       @change="changeMesh">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <div class="change-btn">
                <el-button @click="changeAnimateHandle">{{btnValue}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import * as THREE from 'three'
import initSceneMixin from '@/mixin/initSceneMixin'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default {
  name: 'geom',
  mixins: [initSceneMixin],
  data () {
    return {
      value: 0,
      options: Object.freeze([{
        value: 0,
        label: 'BoxBufferGeometry'
      }, {
        value: 1,
        label: 'CircleBufferGeometry'
      }, {
        value: 2,
        label: 'CylinderBufferGeometry'
      }, {
        value: 3,
        label: 'IcosahedronBufferGeometry'
      }, {
        value: 4,
        label: 'OctahedronBufferGeometry'
      }, {
        value: 5,
        label: 'PlaneBufferGeometry'
      }, {
        value: 6,
        label: 'RingBufferGeometry'
      }, {
        value: 7,
        label: 'SphereBufferGeometry'
      }, {
        value: 8,
        label: 'TorusBufferGeometry'
      }, {
        value: 9,
        label: 'TorusKnotBufferGeometry'
      }]),
      geometryArray: Object.freeze([
        new THREE.BoxBufferGeometry(2, 2, 2),
        new THREE.CircleBufferGeometry(2, 60),
        new THREE.CylinderBufferGeometry(1, 1, 1, 8, 8),
        new THREE.IcosahedronBufferGeometry(1, 1),
        new THREE.OctahedronBufferGeometry(1, 0),
        new THREE.PlaneBufferGeometry(1, 1, 4, 4),
        new THREE.RingBufferGeometry(1, 2, 32),
        new THREE.SphereBufferGeometry(2, 32, 32),
        new THREE.TorusBufferGeometry(1, 0.4, 12, 12),
        new THREE.TorusKnotBufferGeometry(1, 0.4)
      ]),
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
      this.geometry = this.geometryArray[0]
      this.mesh = new THREE.Mesh(this.geometryArray[0], new THREE.MeshBasicMaterial({
        color: 0xfefefe,
        wireframe: true,
        opacity: 0.5
      }))
      this.threeScene.add(this.mesh)
      this.threeCamera.position.z = 5
      /**
             * OrbitControls( object : Camera, domElement : HTMLDOMElement )
             * object: （必须）将要被控制的相机。该相机不允许是其他任何对象的子级，除非该对象是场景自身。
             * domElement: （可选）用于事件监听的HTML元素，其默认值为整个文档， 但是如果你只希望在特定的元素上（例如Canvas上）进行控制，在这里进行指定即可。
             * @type {OrbitControls}
             */
      this.controls = new OrbitControls(this.threeCamera, this.webGLRenderer.domElement)
      this.animateHandle()
    },

    changeMesh (value) {
      if (Object.keys(this.mesh).length > 0) {
        this.geometry.dispose()
        this.threeScene.remove(this.mesh)
      }
      if (Object.keys(this.controls).length > 0) {
        // 初始化状态
        this.controls.reset()
      }
      this.geometry = this.geometryArray[value]
      this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({
        color: 0xfefefe,
        wireframe: true,
        opacity: 0.5
      }))
      this.threeScene.add(this.mesh)
      if (this.animateId !== 0) {
        this.cancelAnimateHandle()
      }
      this.animateHandle()
    },

    animateHandle () {
      this.btnValue = '关闭动画'
      const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
      const animate = () => {
        this.animateId = requestAnimationFrame(animate)
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.01
        this.webGLRenderer.render(this.threeScene, this.threeCamera)
      }
      animate()
    },

    cancelAnimateHandle () {
      this.btnValue = '开启动画'
      const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
      cancelAnimationFrame(this.animateId)
    },

    changeAnimateHandle () {
      if (this.btnValue !== '开启动画') {
        this.cancelAnimateHandle()
      } else {
        this.animateHandle()
      }
    },

    onMouseClick (event) {
      event.preventDefault()
      // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
      this.mouseVector.x = (event.clientX / this.canvasWidth) * 2 - 1
      this.mouseVector.y = -(event.clientY / this.canvasHeight) * 2 + 1
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
    .wrapper-select {
        display: flex;
        position: absolute;
        top: 35px;
        right: 50px;
    }

    .change-btn {
        padding-left: 20px;
    }
</style>
