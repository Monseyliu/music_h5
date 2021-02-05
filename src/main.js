import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 初始化样式
import '../src/assets/style/index.css'
// 引入 vue-lazyload
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
  loading: require('components/common/m-header/logo@2x.png'),
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
