import Vue from 'vue'
import Router from 'vue-router'
import HomeView from '@/components/HomeView'
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
import NotFoundView from '@/components/NotFoundView'
import NewsArticleView from '@/components/NewsArticleView'
import NewsView from '@/components/NewsView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/entries',
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
      path: '/register',
      name: 'register',
      component: RegisterView
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
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView
    },
    {
      path: '/news/:id',
      name: 'newsarticle',
      component: NewsArticleView
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFoundView
    }
  ],
  mode: 'history',
  saveScrollPosition: false,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
