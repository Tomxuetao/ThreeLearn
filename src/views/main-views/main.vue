<template>
    <div
        class="site-wrapper"
        :class="{ 'site-sidebar--fold': sidebarFold }">
        <template>
            <main-navbar></main-navbar>
            <main-sidebar></main-sidebar>
            <div class="site-content__wrapper" :style="{ 'min-height': documentClientHeight + 'px' }">
                <main-content v-if="!$store.state.common.contentIsNeedRefresh"></main-content>
            </div>
        </template>
    </div>
</template>

<script>
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainContent from './main-content'

export default {
    provide () {
        return {
            // 刷新
            refresh () {
                this.$store.commit('common/updateContentIsNeedRefresh', true)
                this.$nextTick(() => {
                    this.$store.commit('common/updateContentIsNeedRefresh', false)
                })
            }
        }
    },
    components: {
        MainNavbar,
        MainSidebar,
        MainContent
    },
    mounted () {
        this.resetDocumentClientHeightAndWidth()
    },
    computed: {
        documentClientHeight: {
            get () {
                return this.$store.state.common.documentClientHeight
            },
            set (val) {
                this.$store.commit('common/updateDocumentClientHeight', val)
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
    methods: {
        resetDocumentClientHeightAndWidth () {
            this.documentClientHeight = document.documentElement['clientHeight']
            this.canvasWidth = document.documentElement['clientWidth'] - 302
            window.onresize = () => {
                this.documentClientHeight = document.documentElement['clientHeight']
                this.canvasWidth = document.documentElement['clientWidth'] -302
            }
        }
    }
}
</script>
