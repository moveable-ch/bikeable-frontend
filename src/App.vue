<template>
  <div id="app">
    <transition name="fade">
      <div class="loader" v-if="pending" ></div>
    </transition>
    <transition name="slide-down">
      <div class="msg" v-if="msg"><span>{{ msg }}</span></div>
    </transition>
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
    },
    msg() {
      return this.$store.getters.msg;
    },
    pending() {
      return this.$store.getters.pending;
    }
  },
  components: {
    'header-view': HeaderView
  },
  mounted() {
    this.$store.dispatch('loadEntries');
    this.$store.dispatch('getUserCoords');

    if(this.isLoggedIn) {
      this.$store.dispatch('checkToken')
        .then((data) => {
            // console.log(data);
          }, (data) => {
            this.$router.push('/');
            // console.log('error', data);
          });
    }
  }
}
</script>

<style src="./styles/global.scss" lang="scss"></style>

<style lang="scss">

@import './styles/helpers';

#app {
  position: relative;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: .6s transform $easeOutQuint;
}
.slide-down-enter, .slide-down-leave-to {
  transform: translateY(-100%);
}

.msg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 3;
  background-color: rgba(#222, .8);
  color: #fff;
  padding: 1rem 0;
  text-align: center;
  font-size: .9rem;

  span {
    display: block;
    margin: 0 auto;
    line-height: 1.4;
    max-width: 800px;
  }
}

.loader {
  position: fixed;
  top: 0;
  z-index: 3;
  left: 0;
  width: 100%;
  height: 2px;
  background-image: linear-gradient(to right,  $c-highlight 0%, $c-highlight 49%, $c-main 50%, $c-main 100%);
  background-size: 25% 100%;
  animation: stripe 4s infinite linear;
}

@keyframes stripe {
  from {
    background-position: left bottom;
  }
  to {
    background-position: right bottom;
  }
}

@include desktop() {
  .loader {
    height: 2px;
    background-size: 10% 100%;
    animation: stripe 10s infinite linear;
  }
}

</style>
