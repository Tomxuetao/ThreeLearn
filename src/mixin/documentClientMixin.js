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
            let height = this.documentClientHeight - this.wrapperHeight
            let width = this.documentClientWidth - this.wrapperWidth
            let foldedWidth = this.documentClientWidth - this.sidebarFoldWidth
            if (newValue) {
                // 展开
                this.camera.aspect = width / height
                this.webGLRenderer.setSize(width , height, true)
            } else {
                // 折叠
                this.camera.aspect = foldedWidth / height
                this.webGLRenderer.setSize(foldedWidth, height, true)
            }
            // 更新摄像机投影矩阵。在任何参数被改变以后必须被调用。
            this.camera.updateProjectionMatrix()
        }
    }
}
