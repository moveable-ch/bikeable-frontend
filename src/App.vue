<template>
  <div id="app">
    <header-view></header-view>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
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
    this.$store.dispatch('getUserCoords');
  }
}
</script>

<style src="./styles/global.scss" lang="scss"></style>
<style>
#app {
  position: relative;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s, transform .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter {
  /* transform: scale(1.05); */
}
.fade-leave-to {
  /* transform: scale(.95); */
  /* transform: translateX(-20px); */

}
</style>
