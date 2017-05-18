import Vue from 'vue'
import Router from 'vue-router'
import MapView from '@/components/MapView'
import ListView from '@/components/ListView'
import AboutView from '@/components/AboutView'
import FAQView from '@/components/FAQView'
import PartnerView from '@/components/PartnerView'
import EntryView from '@/components/EntryView'
import AddView from '@/components/AddView'
import LoginView from '@/components/LoginView'
import RegisterView from '@/components/RegisterView'
import PasswordRetrievalView from '@/components/PasswordRetrievalView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/entries',
      name: 'list',
      component: ListView,
      alias: '/'
    },
    {
      path: '/map',
      name: 'map',
      component: MapView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQView
    },
    {
      path: '/partner',
      name: 'partner',
      component: PartnerView
    },
    {
      path: '/entries/:id',
      name: 'entry',
      component: EntryView
    },
    {
      path: '/add',
      name: 'add',
      component: AddView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/forgottenpw',
      name: 'forgottenpw',
      component: PasswordRetrievalView
    }
  ],
  mode: 'history',
  saveScrollPosition: false,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
