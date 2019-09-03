import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/plugins/element-ui/index'
import '@/plugins/element-ui-theme/index'
import '@/icons'
import '@scss/index.scss'
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
