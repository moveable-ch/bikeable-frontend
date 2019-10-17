// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import SocialSharing from 'vue-social-sharing'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import VueHead from 'vue-head'
import store from '@/store'
import locale from './locale.json'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

Vue.use(VueHead);
Vue.use(SocialSharing);
Vue.use(VueI18n);

/* sentry setup */
if(process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://2e16e9a0244442a38099e186eaa64bfa@sentry.io/1782729',
    integrations: [new Integrations.Vue({Vue, attachProps: true})],
  });
}
/* */

const i18n = new VueI18n({
  locale: 'de',
  messages: locale
})

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
