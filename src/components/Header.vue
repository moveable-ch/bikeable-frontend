<template>
  <header class="header" v-bind:class="{ 'is-scrolled': isScrolled }">
    <router-link to="/" class="header__logo"><span>bikeable</span></router-link>
    <button class="burger" v-on:click="navVisible = true"></button>
    <router-link v-if="isLoggedIn" to="/profile" class="header__avatar" :style="{ backgroundImage: 'url(' + userAvatar + ')' }"><span>Profile</span></router-link>
    <nav class="header__mainnav">
      <ul>
        <li><router-link to="/news" exact>News</router-link></li>
        <li><router-link to="/entries" exact>Spots</router-link></li>
        <li><router-link to="/map" exact>Map</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
        <li><language-switch></language-switch></li>
      </ul>
    </nav>
    <transition name="nav-fade">
      <div class="header__menu" v-if="navVisible" @click="navVisible = false">
        <div class="header__menu__inner" @click.stop>
          <button @click="navVisible = false" class="header__menu__close"></button>
          <nav class="header__menu__nav">
            <ul>
              <li><router-link to="/" exact>Home</router-link></li>
              <li><router-link to="/map" exact>Map</router-link></li>
              <li><router-link to="/entries" exact>Spots</router-link></li>
              <li><router-link to="/add" exact>Spot erfassen</router-link></li>
            </ul>
          </nav>
          <nav class="header__menu__nav-secondary">
            <ul>
              <li><router-link to="/profile" exact>Settings</router-link></li>
              <li><a href="#" @click.prevent="logout">Logout</a></li>
              <li><router-link to="/faq" exact>FAQ</router-link></li>
              <li><router-link to="/news" exact>News</router-link></li>
              <li><router-link to="/about" exact>About Bikeable</router-link></li>
              <li><router-link to="/partner" exact>Partner</router-link></li>
            </ul>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>

<script>
import LanguageSwitch from '@/components/LanguageSwitch';

export default {
  name: 'c-header',
  data () {
    return {
      isScrolled: false,
      navVisible: false
    }
  },
  components: {
    'language-switch': LanguageSwitch
  },

  methods: {
    toggleNav() {
      this.navVisible = !this.navVisible;
    },
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/');
        });
    },
    handleScroll() {
      if(window.scrollY > 40) {
        this.isScrolled = true;
      }else{
        this.isScrolled = false;
      }
    },
    setLang(lang) {
      this.$store.dispatch('setLang', lang)
      .then((data) => {
        }, (data) => {
          this.$store.dispatch('handleError', 'Error');
        });
    }
  },

  created() {
    window.addEventListener('scroll', this.handleScroll);
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userData() {
      return this.$store.getters.userData;
    },
    isHome() {
      return (this.$route.path == '/');
    },
    currentLang() {
      return this.$store.getters.lang;
    },
    userData() {
      return this.$store.getters.userData;
    },
    userAvatar() {
      if(!this.userData.profile) return null;
      if(!this.userData.profile.avatar) return null;
      if(this.imageId) {
        return this.imagePreviewUrl;
      }
      return this.userData.profile.avatar.small;
    },
  },

  watch: {
    '$route': function() {
      this.navVisible = false;
    },
    currentLang (to, from) {
      this.$i18n.locale = to;
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.header {
  position: fixed;
  top: 1rem;
  left: 0;
  width: 100%;
  height: 3rem;
  color: $c-black;
  box-sizing: border-box;
  z-index: 3;
  transition: .4s all $easeInOutQuint;

  @include tablet() {
    top: 1rem;
    position: fixed;
    height: 5rem;
  }

  &.is-scrolled {
    top: 0;
    height: 3rem;
    background-color: rgba(#fff, .95);
  }

  &__logo {
    display: block;
    width: 30px;
    height: 3rem;
    background-image: url('../assets/bikeable-logo-gr.svg');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    transition: .4s transform $easeInOutQuint;
    position: absolute;
    left: 1rem;
    top: 0;

    span {
      display: none;
    }

    @include tablet() {
      width: 74px;
      height: 100px;
      position: absolute;
      left: 2rem;
      top: 0;
      transform-origin: 0 0;

      .is-scrolled & {
        transform: translateY(5%) scale(.5);
      }
    }
  }

  .burger {
    display: block;
    width: 1.75rem;
    height: 24px;
    position: absolute;
    top: 50%;
    right: 2rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transform: translateY(-50%);

    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      border-radius: 10px;
      background-color: $c-black;
      box-shadow: 0 11px 0 0 $c-black, 0 22px 0 0 $c-black;
    }
    &:focus {
      outline: none;
    }
  }

  &__avatar {
    display: block;
    position: absolute;
    top: 50%;
    right: 5rem;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 100%;
    border: 2px solid $c-black;
    transform: translateY(-50%);
    background-color: #fff;
    background-size: cover;
    transition: .4s transform $easeInOutQuint;

    span {
      display: none;
    }

    &.router-link-active {
      border-color: $c-main;
    }
    .is-scrolled & {
      transform: translateY(-50%) scale(.7);
    }
  }

  &__mainnav {
    display: none;
    position: absolute;
    right: 9rem;
    top: 50%;
    font-family: $f-body;
    transform: translateY(-50%);

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        display: inline;
        margin-right: .8rem;
        line-height: 1.75;
        font-size: .9rem;

        a {
          color: #869098;
          text-decoration: none;
          font-size: .9rem;
          line-height: 1.75;
          font-weight: 500;

          &.router-link-active {
            color: $c-black;
          }
          &:hover {
            color: $c-black;
          }
        }
      }
    }

    @include tablet() {
      display: block;
    }
  }

  &__menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;

    &::before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: .8;
      background: rgba($c-black, 1);
    }

    &__inner {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
      width: 50%;
      max-width: 450px;
      min-width: 260px;
      background-color: #fff;
      padding: 3rem;
    }
    &__nav {
      font-size: 2rem;
      font-family: $f-head;
      font-weight: 300;
      margin-bottom: 2rem;

      li {
        margin-bottom: 1rem;

        a {
          color: $c-black;

          &.router-link-active {
            color: $c-main;
          }
        }
      }
    }
    &__nav-secondary {
      font-size: .8rem;
      font-family: $f-body;
      font-weight: 300;
      margin-bottom: 2rem;

      li {
        margin-bottom: .5rem;

        a {
          color: $c-black;
        }
      }
    }
    &__close {
      display: block;
      width: 1.5rem;
      height: 1.5rem;
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: transparent;
      border: none;
      cursor: pointer;

      &::before, &::after {
        content: "";
        display: block;
        position: absolute;
        top: .75rem;
        left: 0;
        width: 100%;
        height: 3px;
        border-radius: 3px;
        background-color: $c-black;
      }
      &::before {
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }
      &:focus {
        outline: none;
      }

      &:hover {
        &::before, &::after {
          background: $c-main;
        }
      }
    }
  }

}

.nav-fade-enter-active, .nav-fade-leave-active {
  transition: opacity .8s;

  &::before {
    transition: opacity .8s $easeOutQuint;
  }
  .header__menu__inner {
    transition: transform .8s $easeOutQuint;
  }
}
.nav-fade-enter {
  &::before {
    opacity: 0;
  }
  .header__menu__inner {
    transform: translateX(100%);
  }
}
.nav-fade-enter-to {
  &::before {
    opacity: .8;
  }
  .header__menu__inner {
    transform: translateX(0);
  }
}
.nav-fade-leave {
  // background-color: rgba($c-black, .8);
}
.nav-fade-leave-to {
  &::before {
    opacity: 0;
  }
  .header__menu__inner {
    transform: translateX(100%);
  }
}

</style>
