<template>
  <header class="header" v-bind:class="{ 'is-expanded': isExpanded }">
    <h1>bikeable</h1>
    <button class="burger" v-on:click="toggleNav"></button>
    <nav>
      <ul>
        <li><router-link to="/">Spots</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
        <li v-if="isLoggedIn"><a href="#" @click.prevent="logout">Logout</a></li>
      </ul>
    </nav>
    <div v-if="pending" class="loader"></div>
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
    pending() {
      return this.$store.getters.pending;
    }
  },

  watch: {
    '$route': function() {
      this.isExpanded = false;
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  background-color: #2637DD;
  color: #eee;
  padding: 0 1rem;
  box-sizing: border-box;
  z-index: 1;
  overflow: hidden;

  &.is-expanded {
    height: auto;
  }

  @include desktop() {
    padding: 0 2rem;
  }
}

h1 {
  font-size: 1.5rem;
  line-height: 3rem;
  margin: 0;
  font-weight: bold;
  pointer-events: none;
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
    border-radius: 2px;
    background-color: #eee;
    box-shadow: 0 7px 0 0 #eee, 0 -7px 0 0 #eee;
  }
  &:focus {
    outline: none;
  }
}

nav {
  margin-bottom: 1rem;
  font-family: $f-body;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    line-height: 1.5;

    a {
      color: #eee;
      text-decoration: none;

      &.active {
        text-decoration: underline;
      }
    }
  }
}

.loader {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-image: linear-gradient(to right,  $c-blue 0%, #fff 47%, $c-blue 100%);
  background-size: 25% 100%;
  animation: stripe 4s infinite linear;
  display: block;

  &.is-visible {
    display: block;
  }
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
  .burger {
    display: none;
  }
  h1 {
    display: inline;
  }
  nav {
    display: inline-block;
    margin-bottom: 0;
    margin-left: 2rem;

    ul {

      li {
        display: inline;
        margin-right: 1rem;
      }
    }
  }
}

</style>
