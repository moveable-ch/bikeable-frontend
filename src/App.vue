<template>
  <div id="app">
    <header-view></header-view>
    <router-view :entries="entries"></router-view>
  </div>
</template>

<script>
import HeaderView from '@/components/HeaderView'

export default {
  name: 'app',
  data () {
    return {
      entries: [
        {
          'title': 'Lorem Ipsum',
          'text': 'Lorem Ipsum dolor sit amet bla bla',
          'image': 'https://unsplash.it/500/500',
          'coords': [8.520001, 47.377147],
          'rating': 10,
          'username': 'hans'
        },
        {
          'title': 'Dolor sit amet',
          'text': 'Lorem Ipsum dolor sit amet bla bla',
          'image': 'https://unsplash.it/500/500',
          'coords': [8.521611, 47.374443],
          'rating': 5,
          'username': 'hans'
        }
      ]
    }
  },
  components: {
    'header-view': HeaderView
  }
}
</script>

<style src="./styles/global.scss" lang="scss"></style>
<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  position: relative;
}
</style>
