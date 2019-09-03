<template>
    <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
        <div class="site-navbar__header">
            <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
                <a class="site-navbar__brand-lg" href="javascript:">Venus快速开发平台</a>
                <a class="site-navbar__brand-mini" href="javascript:">Venus</a>
            </h1>
        </div>
        <div class="site-navbar__body clearfix">
            <el-menu
                class="site-navbar__menu"
                mode="horizontal">
                <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
                    <icon-svg name="zhedie"></icon-svg>
                </el-menu-item>
            </el-menu>
            <el-menu
                class="site-navbar__menu site-navbar__menu--right"
                mode="horizontal">
                <el-menu-item index="1" @click="$router.push({ name: 'theme' })">
                    <template slot="title">
                        <el-badge value="new">
                            <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
                        </el-badge>
                    </template>
                </el-menu-item>
            </el-menu>
        </div>
    </nav>
</template>

<script>

export default {
    data () {
        return {}
    },
    computed: {
        navbarLayoutType: {
            get () {
                return this.$store.state.common.navbarLayoutType
            }
        },
        sidebarFold: {
            get () {
                return this.$store.state.common.sidebarFold
            },
            set (val) {
                this.$store.commit('common/updateSidebarFold', val)
            }
        },
        mainTabs: {
            get () {
                return this.$store.state.common.mainTabs
            },
            set (val) {
                this.$store.commit('common/updateMainTabs', val)
            }
        }
    },
    methods: {
    }
}
</script>
