<template>
  <div id="app" v-if="appReady">
    <transition name="fade">
      <div class="loader" v-if="pendingCount > 0" ></div>
    </transition>
    <transition name="slide-down">
      <div class="msg" v-if="msg"><span>{{ msg }}</span></div>
    </transition>
    <c-header v-if="!isEmbed"></c-header>
    <transition name="route-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <c-footer v-if="showFooter"></c-footer>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  name: 'app',
  metaInfo: {
    title: 'Bikeable'
  },
  data () {
    return {
      appReady: false,
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

      if(this.isEmbed) {
        document.body.classList.add('embed');
      }
    },
    currentLang (to, from) {
      this.$i18n.locale = to;
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    msg() {
      return this.$store.getters.msg;
    },
    pendingCount() {
      return this.$store.getters.pendingCount;
    },
    isEmbed() {
      return this.$route.query.embed;
    },
    currentLang() {
      return this.$store.getters.lang;
    }
  },
  components: {
    'c-header': Header,
    'c-footer': Footer
  },
  mounted() {
    this.checkLocalLang();
    this.checkLocalRegion();

    if(this.isEmbed) {
      document.body.classList.add('embed');
    }

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

    this.appReady = true;
  },
  methods: {
    checkLocalLang() {
      let l = localStorage.getItem('lang');

      if(!l) {
        const userLang = navigator.language.substr(0,2);
        if(["de", "en", "fr"].indexOf(l) >= -1) l = userLang;
      }

      if(l) {
        this.$store.dispatch('setLang', l)
        .then((data) => {
          }, (data) => {
            this.$store.dispatch('handleError', 'Error');
          });
      }
    },
    checkLocalRegion() {
      let r = localStorage.getItem('selectedRegion');
      if(r) {
        this.$store.dispatch('setSelectedRegion', r)
        .then((data) => {
          }, (data) => {
            this.$store.dispatch('handleError', 'Error');
          });
      }
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

.route-fade-enter-active, .route-fade-leave-active {
  transition: opacity .3s;
}
.route-fade-enter, .route-fade-leave-to {
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
  z-index: 4;
  background-color: rgba($c-grey, .9);
  color: $c-black;
  height: 3rem;
  text-align: center;
  font-size: .9rem;
  display: flex;
  align-items: center;

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
  z-index: 4;
  left: 0;
  width: 100%;
  height: 2px;
  background-image: linear-gradient(to right,  transparent 0%, transparent 50%, $c-main 50%, $c-main 100%);
  background-size: 200% 100%;
  animation: stripe 5s infinite linear;
}

@keyframes stripe {
  from {
    background-position: 200% bottom;
  }
  to {
    background-position: 0% bottom;
  }
}

@include desktop() {
  .loader {
    height: 2px;
    background-size: 200% 100%;
    animation: stripe 6s infinite linear;
  }
}

</style>
