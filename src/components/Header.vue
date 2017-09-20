<template>
  <header class="header" v-bind:class="{ 'is-expanded': isExpanded, 'is-home': isHome, 'is-scrolled': isScrolled }">
    <div class="container">
      <router-link to="/" class="header__logo"><span>bikeable</span></router-link>
      <button class="burger" v-on:click="toggleNav"></button>
      <nav>
        <ul>
          <li><router-link to="/" exact>Home</router-link></li>
          <li><router-link to="/entries" exact>Spots</router-link></li>
          <li><router-link to="/map" exact>Map</router-link></li>
        </ul>
      </nav>
      <nav class="nav-right">
        <ul>
          <li v-if="isLoggedIn" class="username" @click.prevent="metaNavExpanded = !metaNavExpanded">{{ userData.username }}</li>
          <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
          <!--<li v-if="!isLoggedIn"><router-link to="/register">Registrieren</router-link></li>-->
        </ul>
      </nav>
      <div class="header__metanav" v-bind:class="{ 'is-expanded': metaNavExpanded }">
        <ul>
          <li v-if="isLoggedIn"><router-link to="/profile">Profil</router-link></li>
          <li v-if="isLoggedIn"><a href="#" @click.prevent="logout">Logout</a></li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'c-header',
  data () {
    return {
      isExpanded: false,
      isScrolled: false,
      metaNavExpanded: false
    }
  },

  methods: {
    toggleNav() {
      this.isExpanded = !this.isExpanded;
    },
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/');
        });
    },
    handleScroll() {
      if(!this.isHome) return;

      if(window.scrollY > 400) {
        this.isScrolled = true;
      }else{
        this.isScrolled = false;
      }
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
      return (this.$route.path == '/' && !this.isLoggedIn);
    }
  },

  watch: {
    '$route': function() {
      this.isExpanded = false;
      this.metaNavExpanded = false;
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  background: $c-black;
  color: #fff;
  box-sizing: border-box;
  z-index: 3;
  overflow: hidden;
  transition: .4s height $easeOutQuint, .3s box-shadow, .3s background-color;

  &.is-expanded {
    height: 300px;
    box-shadow: 0 5px 5px rgba(#000, .1);
    background-color: $c-black !important;
    color: #fff !important;
  }
  &.is-home {
    color: $c-black;
    background-color: transparent;

    &.is-scrolled {
      background-color: rgba($c-black, .98);
    }

  }

  .container {
    position: relative;
  }

  @include desktop() {
    top: 0;
    position: relative;
    height: 5rem;
    max-height: 5rem;
    padding-top: 2.5rem;
    box-shadow: none !important;
    overflow: visible;
  }

  &__metanav {


    ul {
      li {
        display: block;

        a {
          font-family: $f-body;
          color: inherit;
          text-decoration: none;
          font-size: 1rem;
          line-height: 1.75;
        }
      }
    }

    @include desktop() {
      position: absolute;
      right: .5rem;
      top: 1.5rem;
      width: 5rem;
      background-color: $c-black;
      text-align: right;
      padding: .5rem;
      padding-right: 1.5rem;
      display: none;

      &.is-expanded {
        display: block;
      }

      ul li a {
        font-size: .9rem;
      }
    }
  }

  &__logo {
    display: block;
    width: 30px;
    height: 3rem;
    background-image: url('../assets/bikeable-logo-gr.svg');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;

    span {
      display: none;
    }

    @include desktop() {
      width: 63px;
      height: 87px;
      position: absolute;
      left: 50%;
      top: -1.5rem;
      margin-left: -31px;
    }
  }

  .burger {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    top: .5rem;
    right: 1rem;
    background-color: transparent;
    border: none;

    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 1rem;
      left: 0;
      width: 100%;
      height: 3px;
      background-color: $c-main;
      box-shadow: 0 7px 0 0 $c-main, 0 -7px 0 0 $c-main;
    }
    &:focus {
      outline: none;
    }
  }

  nav {
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding-left: 0;
    font-family: $f-body;

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      a {
        color: inherit;
        text-decoration: none;
        font-size: 1rem;
        line-height: 1.75;
        font-weight: 400;
        // text-transform: uppercase;

        &.router-link-active {
          // color: $c-highlight;
          // border-bottom: 2px solid #444;
          font-weight: 700;
          // text-decoration: underline;
        }
        &:hover {
          // border-bottom: 2px solid #444;
          // color: $c-main;
        }
      }
    }
    .username {
      font-family: $f-body;
      font-size: 1rem;
      border-top: 1px solid lighten($c-black, 10%);
      padding-top: .5rem;

      @include desktop() {
        border-top: 0;
        cursor: pointer;
        font-size: .9rem;

        &:hover {
          color: #ccc;
        }

        &::after {
          display: inline-block;
          content: "◢";
          transform: translateY(-6px) rotate(45deg);
          font-size: .5rem;
          margin-left: .5rem;
        }
      }
    }

    &.nav-right {
      margin-bottom: .5rem;
    }

    @include desktop() {
      display: inline-block;
      margin-bottom: 0;
      margin-left: 0;
      margin-top: 0;
      padding-left: 0;

      ul {

        li {
          display: inline;
          margin-right: 1rem;
          line-height: 1.75;
          font-size: .9rem;

          a {
            // letter-spacing: .03rem;
          }
        }
      }

      &.nav-right {
        position: absolute;
        top: 0;
        right: 1rem;
        margin-top: 0;
        margin-bottom: 0;

        ul {
          li {
            margin-right: 0;
            margin-left: 1rem;
          }
        }
      }
    }
  }

  @include desktop() {
    .burger {
      display: none;
    }
  }
}

</style>
