import Vue from 'vue'
import Router from 'vue-router'
import MapView from '@/components/MapView'
import ListView from '@/components/ListView'
import AboutView from '@/components/AboutView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'map',
      component: MapView
    },
    {
      path: '/list',
      name: 'list',
      component: ListView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    }
  ]
})
