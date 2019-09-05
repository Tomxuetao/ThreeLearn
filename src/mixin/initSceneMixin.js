import * as THREE from 'three'
export default {
    data () {
        return {
            threeScene: {},
            webGLRenderer: {},
            threeCamera: {},
            wrapperHeight: this.$route.meta.isTab ? 166 : 126,
            wrapperWidth: 302,
            sidebarFoldWidth: 136
        }
    },
    computed: {
        documentClientHeight: {
            get () {
                return this.$store.state.common.documentClientHeight
            }
        },
        documentClientWidth: {
            get () {
                return this.$store.state.common.documentClientWidth
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
            let width = this.documentClientWidth - this.wrapperWidth
            let foldedWidth = this.documentClientWidth - this.sidebarFoldWidth
            if (newValue) {
                // 展开
                this.threeCamera.aspect = width / height
                this.webGLRenderer.setSize(width, height, true)
            } else {
                // 折叠
                this.threeCamera.aspect = foldedWidth / height
                this.webGLRenderer.setSize(foldedWidth, height, true)
            }
            // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
            this.threeCamera.updateProjectionMatrix()
        }
    },
    mounted () {
        this.$nextTick(() => {
            this.initScene(this.documentClientWidth - this.wrapperWidth, this.documentClientHeight - this.wrapperHeight)
        })
    },
    methods: {
        initScene (width, height) {
            this.threeScene = new THREE.Scene()
            this.threeCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
            this.webGLRenderer = new THREE.WebGLRenderer({
                antialias: true
            })
            this.webGLRenderer.setSize(width, height)
            this.webGLRenderer.setPixelRatio(window.devicePixelRatio)
            this.addSomethingToScene(this.threeScene)
        }
    }
}
