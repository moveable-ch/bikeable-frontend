<template>
  <div v-if="maintenanceMode" class="contentpage notfound">
    <div class="container">
      <img src="https://media.giphy.com/media/StWnlQipuBrz2/giphy.gif">
      <h1>maintenance</h1>
      <p>{{ $t('notfound.backsoon') }}</p>
    </div>
  </div>
  <!-- <div v-if="maintenanceMode">
    <img src="https://media.giphy.com/media/nxuFTiUbYR3SE/giphy.gif"
         class="maintenance-img" />
    <h1 class="maintenance">
      We are having some technical problems and will be back soon.
    </h1>
  </div> -->
  <div id="app"
       v-else-if="appReady">
    <transition name="fade">
      <div class="loader"
           v-if="pendingCount > 0"></div>
    </transition>
    <transition name="slide-down">
      <div class="msg"
           v-if="msg">
        <span>{{ msg }}</span>
      </div>
    </transition>
    <c-header v-if="!isEmbed"></c-header>
    <transition name="route-fade"
                mode="out-in">
      <keep-alive include="v-map,v-list">
        <router-view></router-view>
      </keep-alive>
    </transition>
    <c-footer v-if="showFooter"></c-footer>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default {
  name: "app",
  metaInfo: {
    title: "Bikeable",
  },
  data() {
    return {
      appReady: false,
      transitionName: "fade",
      showFooter: true,
    };
  },
  watch: {
    $route(to, from) {
      if (to.name == "map") {
        this.showFooter = false;
      } else {
        this.showFooter = true;
      }

      if (this.isEmbed) {
        document.body.classList.add("embed");
      }
    },
    currentLang(to, from) {
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
    showEmbedControls() {
      return this.$route.query.controls;
    },
    currentLang() {
      return this.$store.getters.lang;
    },
    isWebApp() {
      return window.navigator.standalone;
    },
    maintenanceMode() {
      return process.env.VUE_APP_MAINTENANCE_MODE == 1;
    }
  },
  components: {
    "c-header": Header,
    "c-footer": Footer,
  },
  mounted() {
    this.checkLocalLang();
    this.checkLocalRegion();
    this.checkLocalCountry();
    
    if (this.isEmbed) {
      document.body.classList.add("embed");
    }
    if (this.isWebApp) {
      document.body.classList.add("webapp");
    }

    this.$store.dispatch("getUserCoords");
    this.$store.dispatch("getCategories");

    if (this.isLoggedIn) {
      this.$store.dispatch("checkToken").then(
        (data) => {
          // console.log(data);
        },
        (data) => {
          this.$router.push("/");
          // console.log('error', data);
        }
      );
    }

    if (this.$router.currentRoute.name == "map") this.showFooter = false;

    this.$store.dispatch("initMapsApi");
    this.appReady = true;
  },
  methods: {
    checkLocalLang() {
      let l = localStorage.getItem("lang");

      if(this.$route.query.lang) {
        l = this.$route.query.lang;
      }
      if (!l) {
        const userLang = navigator.language.substr(0, 2);
        if (["de", "en", "fr", "it"].indexOf(l) >= -1) l = userLang;
      }

      if (l) {
        this.$store.dispatch("setLang", l).then(
          (data) => {},
          (data) => {
            this.$store.dispatch("handleError", "Error");
          }
        );
      }
    },
    checkLocalRegion() {
      let r = localStorage.getItem("selected-region");
      if (r) {
        this.$store.dispatch("setSelectedRegion", r).then(
          (data) => {},
          (data) => {
            this.$store.dispatch("handleError", "Error");
          }
        );
      }
    },
    checkLocalCountry() {
      let c = localStorage.getItem("country");

      if(this.$route.query.country) {
        c = this.$route.query.country;
      }

      if(c == null) {
        let host = window.location.host;

        if(host.includes("bikeable.ch")) {
          c = "ch";
        } else if(host.includes("bikeable.at")) {
          c = "at";
        } else if(host.includes("bikeable.de")) {
          c = "de";
        } else if(host.includes("bikeable.fr")) {
          c = "fr";
        } else if(host.includes("bikeablecity.org")) {
          c = "us";
        } else if(this.$route.query.country) {
          c = this.$route.query.country;
        }
      }

      if (c) {
        this.$store.dispatch("setCountry", c).then(
          (data) => {},
          (data) => {
            this.$store.dispatch("handleError", "Error");
          }
        );
      }
    },
  },
};
</script>

<style src="./styles/global.scss" lang="scss"></style>

<style lang="scss">
@import "./styles/helpers";

#app {
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.route-fade-enter-active,
.route-fade-leave-active {
  transition: opacity 0.3s;
}
.route-fade-enter,
.route-fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: 0.6s transform $easeOutQuint;
}
.slide-down-enter,
.slide-down-leave-to {
  transform: translateY(-100%);
}

.msg {
  position: fixed;
  top: 0;
  left: 1rem;
  width: calc(100% - 2rem);
  height: auto;
  z-index: 4;
  border-radius: .75rem;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: rgba($c-black, 0.7);
  backdrop-filter: blur(5px);
  color: $c-white;
  height: 3rem;
  text-align: center;
  font-size: 0.9rem;
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
  height: 4px;
  background-image: linear-gradient(
    to right,
    transparent 0%,
    transparent 50%,
    $c-main 50%,
    $c-main 100%
  );
  background-size: 200% 100%;
  animation: stripe 5s infinite linear;

  @include desktop {
    height: 6px;
  }
}

h1.maintenance {
  font-size: 2rem;
  line-height: 1.3;
  padding: 0 2rem;
}
img.maintenance-img {
  display: block;
  margin: 2rem auto;
  width: 100%;
  max-width: 600px;
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
