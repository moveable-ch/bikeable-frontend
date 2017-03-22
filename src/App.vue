<template>
  <div id="app">
    <header-view></header-view>
    <router-view></router-view>
  </div>
</template>

<script>
import HeaderView from '@/components/HeaderView'

export default {
  name: 'app',
  data () {
    return {}
  },
  components: {
    'header-view': HeaderView
  },
  mounted() {
    this.$store.dispatch('loadEntries');
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
