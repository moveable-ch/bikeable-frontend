import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home'
import Map from '@/views/Map'
import List from '@/views/List'
import MyList from '@/views/MyList'
import About from '@/views/About'
import FAQ from '@/views/FAQ'
import Partner from '@/views/Partner'
import Entry from '@/views/Entry'
import AddForm from '@/views/AddForm'
import LoginForm from '@/views/LoginForm'
import RegisterForm from '@/views/RegisterForm'
import PasswordRetrieval from '@/views/PasswordRetrieval'
import NotFound from '@/views/NotFound'
import NewsArticle from '@/views/NewsArticle'
import News from '@/views/News'
import UserProfile from '@/views/UserProfile'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/entries',
      name: 'list',
      component: List
    },
    {
      path: '/map',
      name: 'map',
      component: Map
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQ
    },
    {
      path: '/partner',
      name: 'partner',
      component: Partner
    },
    {
      path: '/entries/:id',
      name: 'entry',
      component: Entry
    },
    {
      path: '/myentries',
      name: 'mylist',
      component: MyList
    },
    {
      path: '/add',
      name: 'add',
      component: AddForm
    },
        {
      path: '/edit/:id',
      name: 'edit',
      component: AddForm
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm
    },
    {
      path: '/login',
      name: 'login',
      component: LoginForm
    },
    {
      path: '/forgottenpw',
      name: 'forgottenpw',
      component: PasswordRetrieval
    },
    {
      path: '/profile',
      name: 'userprofile',
      component: UserProfile
    },
    {
      path: '/news',
      name: 'news',
      component: News
    },
    {
      path: '/news/:id',
      name: 'newsarticle',
      component: NewsArticle
    },
    {
      path: '*',
      name: 'not-found',
      component: NotFound
    }
  ],
  mode: 'history',
  saveScrollPosition: true,
  scrollBehavior(to, from, savedPosition) {
    let newPos = { x: 0, y: 0 }
    if (savedPosition) {
      newPos = savedPosition
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(newPos)
      }, 300)
    })
  }
})
