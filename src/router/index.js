import Vue from 'vue'
import Router from 'vue-router'
import MapView from '@/components/MapView'
import ListView from '@/components/ListView'
import AboutView from '@/components/AboutView'
import EntryView from '@/components/EntryView'
import AddView from '@/components/AddView'
import LoginView from '@/components/LoginView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list',
      component: ListView
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
      path: '/entry/:id',
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
    }
  ]
})
