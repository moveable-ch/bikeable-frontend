<template>
  <div id="app">
    <transition name="fade">
      <div class="loader" v-if="pending" ></div>
    </transition>
    <transition name="slide-down">
      <div class="msg" v-if="msg"><span>{{ msg }}</span></div>
    </transition>
    <header-view v-if="!isEmbed"></header-view>
    <transition :name="transitionName" mode="out-in">
      <router-view></router-view>
    </transition>
    <footer-view v-if="showFooter"></footer-view>
  </div>
</template>

<script>
import HeaderView from '@/components/HeaderView'
import FooterView from '@/components/FooterView'

export default {
  name: 'app',
  metaInfo: {
    title: 'Bikeable'
  },
  data () {
    return {
      transitionName: 'fade',
      showFooter: true
    }
  },
  watch: {
    '$route' (to, from) {
      if(to.name == 'map') {
        this.showFooter = false;
      }else{
        this.showFooter = true;
      }
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
    },
    isEmbed() {
      return this.$route.query.embed;
    }
  },
  components: {
    'header-view': HeaderView,
    'footer-view': FooterView
  },
  mounted() {
    this.$store.dispatch('loadEntries');
    this.$store.dispatch('loadSponsors');
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

    if(this.$router.currentRoute.name == 'map') this.showFooter = false;
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
  height: 3px;
  background-image: linear-gradient(to right,  $c-highlight 0%, $c-main 50%, $c-highlight 100%);
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
    height: 4px;
    background-size: 33% 100%;
    animation: stripe 2s infinite linear;
  }
}

</style>
