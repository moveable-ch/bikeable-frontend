<template>
  <header class="header" v-bind:class="{ 'is-expanded': isExpanded }">
    <h1>bikeäble</h1>
    <button class="burger" v-on:click="toggleNav"></button>
    <nav>
      <ul>
        <li><router-link to="/">Map</router-link></li>
        <li><router-link to="/list">List</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul>
    </nav>
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

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: #333;
  color: #fff;
  padding: 0 1rem;
  box-sizing: border-box;
  z-index: 1;
  overflow: hidden;

  &.is-expanded {
    height: auto;
  }
}

h1 {
  font-size: 1rem;
  line-height: 50px;
  margin: 0;
}

.burger {
  display: block;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 13px;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: #fff;
    box-shadow: 0 10px 0 0 #fff, 0 -10px 0 0 #fff;
  }
  &:focus {
    outline: none;
  }
}

nav {
  margin-bottom: 1rem;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    line-height: 1.5;

    a {
      color: #fff;
      text-decoration: none;
    }
  }
}

@media screen and (min-width: 600px) {
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
