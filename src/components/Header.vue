<template>
  <header class="header" v-bind:class="{ 'is-scrolled': isScrolled, 'is-logged-in': isLoggedIn, 'is-slim': isSlim }">
    <router-link to="/" class="header__logo"><span>bikeable</span></router-link>
    <a v-if="true" href="#" class="header__back" @click.prevent="historyBack"></a>
    <button class="burger" v-on:click="navVisible = true"></button>
    <router-link v-if="isLoggedIn" to="/profile" class="header__avatar" :style="{ backgroundImage: 'url(' + userAvatar + ')' }"><span>Profile</span></router-link>
    <nav class="header__mainnav">
      <ul>
        <li><router-link to="/news" exact>News</router-link></li>
        <li><router-link to="/entries" exact>Spots</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/myentries" exact>My Spots</router-link></li>
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
              <li v-if="isLoggedIn"><router-link to="/myentries" exact>My Spots</router-link></li>
              <li v-if="isLoggedIn"><router-link to="/add" exact>{{ $t('home.addspot') }}</router-link></li>
            </ul>
          </nav>
          <nav class="header__menu__nav-secondary">
            <ul>
              <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
              <li v-if="!isLoggedIn"><router-link to="/register">{{ $t('register.register') }}</router-link></li>
              <li v-if="isLoggedIn"><router-link to="/profile" exact>{{ $t('profile.preferences') }}</router-link></li>
              <li v-if="isLoggedIn"><a href="#" @click.prevent="logout">Logout</a></li>
            </ul>
            <ul>
              <li><router-link to="/faq" exact>FAQ</router-link></li>
              <li><router-link to="/news" exact>News</router-link></li>
              <li><router-link to="/about" exact>About Bikeable</router-link></li>
              <li><router-link to="/partner" exact>{{ $t('partner.partner') }}</router-link></li>
            </ul>
            <ul>
              <li><language-switch flipped="true"></language-switch></li>
              <li><country-switch></country-switch></li>
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
    historyBack() {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/');
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
    userData() {
      return this.$store.getters.userData;
    },
    userAvatar() {
      if(!this.userData) return null;
      if(!this.userData.profile) return null;
      if(!this.userData.profile.avatar) return null;
      if(this.imageId) {
        return this.imagePreviewUrl;
      }
      return this.userData.profile.avatar.small;
    },
    isSlim() {
      return this.$route.path == '/map';
    }
  },

  watch: {
    '$route': function() {
      this.navVisible = false;
    },
    isLoggedIn() {
      this.navVisible = false;
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
  border-bottom: 1px solid transparent;
  transition: .4s all $easeInOutQuint;

  @include tablet() {
    top: 1rem;
    position: fixed;
    height: 5rem;
  }

  &.is-scrolled, &.is-slim {
    top: 0;
    height: 3rem;
    background-color: #fff;
    border-bottom: 1px solid $c-grey-dark;
  }

  &__logo {
    display: block;
    width: 34px;
    height: 50px;
    background-image: url('../assets/bikeable-logo-gr.svg');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    transition: .4s transform $easeInOutQuint, .4s top $easeInOutQuint;
    position: absolute;
    left: 1rem;
    top: 0;

    span {
      display: none;
    }

    .is-scrolled &, .is-slim & {
      transform: translateY(-50%) scale(.8);
      top: 50%;
    }
    .webapp & {
      left: 4rem;

      @include tablet {
        left: 5rem;
      }
    }

    @include tablet() {
      width: 74px;
      height: 100px;
      position: absolute;
      left: 2rem;
      transform-origin: 0 0;

      .is-scrolled &, .is-slim & {
        transform: scale(.4) translateY(-50%);
        top: 50%;
      }
    }
  }
  &__back {
    display: none;
    width: 50px;
    height: 50px;
    position: absolute;
    top: 0;
    left: .5rem;
    background-image: url('../assets/icon-back.png');
    background-size: 100%;

    @include tablet {
      left: 1rem;
      top: 1.5rem;
    }
    .webapp & {
      display: block;
    }
  }

  .burger {
    display: block;
    width: 1.75rem;
    height: 24px;
    position: absolute;
    top: 50%;
    right: 1rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
    transform: translateY(-50%);

    @include tablet {
      right: 2rem;
    }

    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      // border-radius: 2px;
      background-color: $c-black;
      box-shadow: 0 9px 0 0 $c-black, 0 18px 0 0 $c-black;
      transition: .5s background-color, .5s box-shadow;
    }
    &:focus {
      outline: none;
    }
    &:hover {
      &::before {
        background-color: $c-main;
        box-shadow: 0 9px 0 0 $c-main, 0 18px 0 0 $c-main;
      }
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
    box-shadow: 0 0 0 1px #fff, 0 0 0 2px $c-black;
    transform: translateY(-50%);
    background-color: #fff;
    background-size: cover;
    transition: .4s transform $easeInOutQuint, .5s border-color;

    span {
      display: none;
    }

    &.router-link-active {
      border-color: $c-main;
    }
    .is-scrolled &, .is-slim & {
      transform: translateY(-50%) scale(.7);
    }
    &:hover {
      border-color: $c-main;
    }
  }

  &__mainnav {
    display: none;
    position: absolute;
    right: 5rem;
    top: 50%;
    font-family: $f-body;
    transform: translateY(-50%);

    .is-logged-in & {
      right: 9rem;
    }

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
        display: inline;
        margin-right: 1rem;
        line-height: 1.75;
        font-size: .9rem;

        a {
          color: $c-black;
          text-decoration: none;
          font-size: 1rem;
          line-height: 1.75;
          font-weight: 400;

          &.router-link-active, &:hover {
            text-decoration: underline;
            // text-decoration-color: $c-main;
            text-underline-offset: 2px;
            text-decoration-thickness: 1px;
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
      // opacity: .8;
      opacity: 1;
      background-color: rgba($c-black, .8);
      backdrop-filter: blur(3px);
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
      padding: 2rem;
      box-sizing: border-box;
      // overflow-y: scroll;

      @include tablet {
        padding: 3rem;
      }
    }
    &__nav {
      font-size: 2rem;
      font-family: $f-head;
      font-weight: 700;
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
      font-size: 1rem;
      font-family: $f-body;
      font-weight: 400;
      margin-bottom: 2rem;

      > ul {
        margin-bottom: 2rem;
      }
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
      top: 2rem;
      right: 2rem;
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
        height: 4px;
        // border-radius: 2px;
        background-color: $c-black;
        transition: .5s background-color;
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
    transition: opacity .8s $easeOutQuint, .8s background-color;
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
    opacity: 1;
  }
  .header__menu__inner {
    transform: translateX(0);
  }
}
// .nav-fade-leave {
  // background-color: rgba($c-black, .8);
// }
.nav-fade-leave-to {
  &::before {
    opacity: 0;
  }
  .header__menu__inner {
    transform: translateX(100%);
  }
}

</style>
