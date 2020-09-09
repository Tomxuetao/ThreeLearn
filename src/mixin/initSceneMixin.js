import * as THREE from 'three'
export default {
  data () {
    return {
      threeScene: {},
      webGLRenderer: {},
      threeCamera: {},
      cameraHelper: {},
      wrapperHeight: this.$route.meta.isTab ? 166 : 126
    }
  },
  computed: {
    documentClientHeight: {
      get () {
        return this.$store.state.common.documentClientHeight
      }
    },
    canvasHeight: {
      get () {
        return this.$store.state.common.canvasHeight
      }
    },
    canvasWidth: {
      get () {
        return this.$store.state.common.canvasWidth
      },
      set (val) {
        this.$store.commit('common/updateCanvasWidth', val)
      }
    },
    sidebarFold: {
      get () {
        return this.$store.state.common.sidebarFold
      }
    }
  },
  watch: {
    sidebarFold (oldValue, newValue) {
      let height = this.documentClientHeight - this.wrapperHeight
      if (newValue) {
        // 展开
        this.canvasWidth = this.canvasWidth - 166
        this.threeCamera.aspect = this.canvasWidth / height
        this.webGLRenderer.setSize(this.canvasWidth, height)
      } else {
        // 折叠
        this.canvasWidth = this.canvasWidth + 166
        this.threeCamera.aspect = this.canvasWidth / height
        this.webGLRenderer.setSize(this.canvasWidth, height)
      }
      // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
      this.threeCamera.updateProjectionMatrix()
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.initScene(this.canvasWidth, this.documentClientHeight - this.wrapperHeight)
    })
  },

  beforeDestroy () {
    console.log(this.threeScene)
    this.webGLRenderer.clear(true, true, true)
    this.webGLRenderer.dispose()
    // 清空场景
    this.threeScene.children = []
  },

  methods: {
    initScene (width, height) {
      this.threeScene = new THREE.Scene()
      this.threeCamera = new THREE.PerspectiveCamera(35, width / height, 1, 10000)
      this.threeCamera.position.z = 2500
      this.webGLRenderer = new THREE.WebGLRenderer({
        antialias: true
      })
      this.webGLRenderer.autoClear = true
      this.webGLRenderer.setSize(width, height)
      this.webGLRenderer.setPixelRatio(window.devicePixelRatio)
      this.webGLRenderer.enabled = true
      this.webGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap
      this.addSomethingToScene()
    }
  }
}
