<template>
  <div id="app">
    <header-view></header-view>
    <transition :name="transitionName" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import HeaderView from '@/components/HeaderView'

export default {
  name: 'app',
  data () {
    return {
      transitionName: 'fade'
    }
  },
  watch: {
    '$route' (to, from) {
      // if(to.name == 'list' && from.name == 'map') {
      //   this.transitionName = 'slide-right';
      // } else if (to.name == 'map' && from.name == 'list') {
      //   this.transitionName = 'slide-left';
      // } else {
      //   this.transitionName = 'fade';
      // }
    }
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

.slide-right-enter-active, .slide-right-leave-active, .slide-left-enter-active, .slide-left-leave-active {
  transition: opacity .5s, transform .5s;
}
.slide-right-enter, .slide-left-leave-to {
  transform: translateX(50px);
  opacity:  0;
}
.slide-right-leave-to, .slide-left-enter {
  transform: translateX(-50px);
  opacity:  0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

</style>
