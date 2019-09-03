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
    computed: {
        documentClientHeight: {
            get () {
                return this.$store.state.common.documentClientHeight
            },
            set (val) {
                this.$store.commit('common/updateDocumentClientHeight', val)
            }
        },
        sidebarFold: {
            get () {
                return this.$store.state.common.sidebarFold
            }
        }
    },
    mounted () {
        this.resetDocumentClientHeight()
    },
    methods: {
        // 重置窗口可视高度
        resetDocumentClientHeight () {
            this.documentClientHeight = document.documentElement['clientHeight']
            window.onresize = () => {
                this.documentClientHeight = document.documentElement['clientHeight']
            }
        }
    }
}
</script>
