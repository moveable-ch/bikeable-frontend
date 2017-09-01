<template>
  <header class="header" v-bind:class="{ 'is-expanded': isExpanded }">
    <div class="header__backdrop" v-if="isExpanded" v-on:click="toggleNav"></div>
    <div class="container">
      <h1><router-link to="/">bikeable</router-link><span>beta</span></h1>
      <button class="burger" v-on:click="toggleNav"></button>
      <nav>
        <ul>
          <li><router-link to="/entries" exact>Spots</router-link></li>
          <li><router-link to="/map" exact>Map</router-link></li>
        </ul>
      </nav>
      <nav class="nav-right">
        <ul>
          <li v-if="userData" class="username">{{ userData.username }}</li>
          <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
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
      isExpanded: false
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
    }
  },

  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userData() {
      return this.$store.state.userData;
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
  height: 4rem;
  background-color: #fff;
  color: $c-main;
  box-sizing: border-box;
  z-index: 2;
  overflow: hidden;
  transition: .4s height $easeOutQuint;

  &.is-expanded {
    height: 15rem;
  }

  &__backdrop {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 15rem);
    background-color: rgba(#fff, 0);

    @include desktop() {
      display: none;
    }
  }

  .container {
    position: relative;
  }

  @include desktop() {
    position: relative;
    padding-top: 3rem;
    height: 9rem;
    max-height: 9rem;
  }

  h1 {
    font-size: 2rem;
    line-height: 4rem;
    margin: 0;
    color: $c-main;
    font-weight: 500;
    position: relative;
    padding-left: 2.3rem;

    &::before {
      content: "";
      display: block;
      background-image: url('../assets/bikeable-logo-gr.svg');
      background-size: 100%;
      background-repeat: no-repeat;
      width: 2.1rem;
      height: 3rem;
      position: absolute;
      top: .5rem;
      left: 0;
    }

    a {
      color: $c-main;
      text-decoration: none;
    }

    span {
      font-size: .8rem;
      position: absolute;
      bottom: -1.2rem;
      left: 2.4rem;
    }

    @include desktop() {
      display: inline-block;
      padding-left: 4.4rem;
      font-size: 2.75rem;
      line-height: 2.75rem;

      &::before {
        width: 73px;
        height: 100px;
        top: -1.5rem;
      }

      span {
        font-size: .9rem;
        position: absolute;
        bottom: -1.5rem;
        left: 4.5rem;
      }
    }
  }

  .burger {
    display: block;
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    top: 1rem;
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
    margin-top: .5rem;
    padding-left: 2.4rem;
    font-family: $f-body;

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      a {
        color: $c-main;
        text-decoration: none;
        font-size: 1.25rem;
        line-height: 1.5;
        font-weight: 500;
        transition: .1s color;

        &.router-link-active {
          color: $c-highlight;
          // border-bottom: 2px solid $c-main;
        }
      }
    }
    .username {
      font-size: 1.25rem;
      // display: inline-block;
      // white-space: nowrap;
      // max-width: 10rem;
      // overflow: hidden;
      // line-height: 1;
      // height: auto;
      // text-overflow: ellipsis;
    }

    @include desktop() {
      display: inline-block;
      margin-bottom: 0;
      margin-left: 2rem;
      padding-left: 0;

      .username {
        font-size: 1rem;
      }

      ul {

        li {
          display: inline;
          margin-right: 1rem;

          a {
            font-size: 1rem;
          }
        }
      }

      &.nav-right {
        position: absolute;
        bottom: 0;
        right: 0;
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
