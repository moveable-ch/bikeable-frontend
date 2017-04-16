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
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    }
  },
  components: {
    'header-view': HeaderView
  },
  mounted() {
    this.$store.dispatch('loadEntries');
    this.$store.dispatch('getUserCoords');

    // if(this.isLoggedIn) {
    //   this.$store.dispatch('checkToken')
    //     .then((data) => {
    //         console.log(data);
    //       }, (data) => {
    //         // this.$router.push('/');
    //         console.log('error', data);
    //       });
    // }
  }
}
</script>

<style src="./styles/global.scss" lang="scss"></style>
<style>
#app {
  position: relative;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

</style>
