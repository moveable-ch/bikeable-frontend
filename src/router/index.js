import Vue from 'vue'
import Router from 'vue-router'
import MapView from '@/components/MapView'
import ListView from '@/components/ListView'
import AboutView from '@/components/AboutView'
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
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/forgottenpw',
      name: 'forgottenpw',
      component: PasswordRetrievalView
    }
  ]
})
