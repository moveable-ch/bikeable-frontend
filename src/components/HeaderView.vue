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
          <li v-if="userData" class="username">{{ userData.username }}</li>
          <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
          <!--<li v-if="!isLoggedIn"><router-link to="/register">Registrieren</router-link></li>-->
          <li v-if="isLoggedIn"><a href="#" @click.prevent="logout">Logout</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'header-view',
  data () {
    return {
      isExpanded: false,
      isScrolled: false
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
  background: #fafafa;
  color: #444;
  box-sizing: border-box;
  z-index: 2;
  overflow: hidden;
  transition: .4s height $easeOutQuint, .3s box-shadow, .3s background-color;

  &.is-expanded {
    height: 50vh;
    box-shadow: 0 5px 5px rgba(#000, .05);
    background-color: #fafafa !important;
  }
  &.is-home {
    background-color: transparent;

    &.is-scrolled {
      background-color: rgba(#fafafa, .98);
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
    padding-top: 3rem;
    box-shadow: none !important;
    overflow: visible;
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
      top: -1.25rem;
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
    font-family: $f-head;

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      a {
        color: #444;
        text-decoration: none;
        font-size: 1rem;
        line-height: 1.75;
        font-weight: bold;
        text-transform: uppercase;

        &.router-link-active {
          // color: $c-highlight;
          border-bottom: 2px solid #444;
          // text-decoration: underline;
        }
        &:hover {
          // border-bottom: 2px solid #444;
          // color: $c-main;
        }
      }
    }
    .username {
      font-size: 1rem;
    }

    @include desktop() {
      display: inline-block;
      margin-bottom: 0;
      margin-left: 0;
      margin-top: 0;
      padding-left: 0;

      .username {
        font-size: 1rem;
        font-weight: 400;
        color: #aaa;
      }

      ul {

        li {
          display: inline;
          margin-right: 1rem;

          a {
            font-size: .8rem;
            letter-spacing: .03rem;
          }
        }
      }

      &.nav-right {
        position: absolute;
        top: 0;
        right: 1rem;
        margin-top: 0;

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
