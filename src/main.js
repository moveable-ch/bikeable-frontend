// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import SocialSharing from 'vue-social-sharing'
import App from './App'
import router from './router'
// import Meta from 'vue-meta'
import VueHead from 'vue-head'
import store from '@/store/store'

Vue.use(VueResource);
// Vue.use(Meta);
Vue.use(VueHead);
Vue.use(SocialSharing);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
