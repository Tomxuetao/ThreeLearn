export default {
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
            let height = this.documentClientHeight
            let width = this.documentClientWidth
            if (newValue) {
                // 展开
                this.camera.aspect = (width - 302) / (height - 125)
                this.webGLRenderer.setSize(width - 302, height - 125)
            } else {
                // 折叠
                this.camera.aspect = (width - 136) / (height - 125)
                this.webGLRenderer.setSize(width - 136, height - 125)
            }
            // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
            this.camera.updateProjectionMatrix()
        }
    }
}
