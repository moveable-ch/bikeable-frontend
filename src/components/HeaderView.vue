<template>
  <header class="header" v-bind:class="{ 'is-expanded': isExpanded }">
    <div class="container">
      <h1><router-link to="/">bikeable</router-link></h1>
      <button class="burger" v-on:click="toggleNav"></button>
      <nav>
        <ul>
          <li><router-link to="/">Spots</router-link></li>
          <li><router-link to="/map">Map</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
          <li v-if="isLoggedIn"><a href="#" @click.prevent="logout">Logout</a></li>
        </ul>
      </nav>
    </div>
    <div v-if="pending" class="loader"></div>
    <div class="msg" v-if="msg">
      <div class="container">
        {{ msg }}
      </div>
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
    pending() {
      return this.$store.getters.pending;
    },
    msg() {
      return this.$store.getters.msg;
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
  background-color: #fff;
  color: $c-main;
  box-sizing: border-box;
  z-index: 1;
  overflow: hidden;

  &.is-expanded {
    height: auto;
  }

  @include desktop() {
    position: relative;
    padding-top: 3rem;
    height: 9rem;
  }
}

h1 {
  font-size: 2rem;
  line-height: 3rem;
  margin: 0;
  color: $c-main;
  font-weight: 500;
  position: relative;
  padding-left: 2.4rem;

  &::before {
    content: "";
    display: block;
    background-image: url(data:image/svg+xml;base64,PHN2ZyBpZD0iRWJlbmVfMSIgZGF0YS1uYW1lPSJFYmVuZSAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjUgMzUwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzE0YmRjYzt9LmNscy0ye2ZpbGw6I2ZmMDA5Mzt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPlplaWNoZW5mbMOkY2hlIDI4IEtvcGllIDIxPC90aXRsZT48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xNTguNjMsMjMxLjU5YS41My41MywwLDAsMC0uMzMtLjMzLDI3LjE3LDI3LjE3LDAsMCwwLTE3Ljc3LjMzLjY1LjY1LDAsMCwwLS40MS40LjU3LjU3LDAsMCwwLC4wNi41bDguOTQsMTQuNTlhLjU4LjU4LDAsMCwwLC41My4yOS41OS41OSwwLDAsMCwuNTItLjMxbDguNDItMTQuOTRBLjY0LjY0LDAsMCwwLDE1OC42MywyMzEuNTlaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTQ5LjY4LDI0OS4xM2EyLjM0LDIuMzQsMCwwLDEtMi0xLjEybC04Ljk0LTE0LjU5YTIuMzMsMi4zMywwLDAsMS0uMjItMiwyLjQxLDIuNDEsMCwwLDEsMS40Ni0xLjQ3LDI4LjkyLDI4LjkyLDAsMCwxLDE4LjkyLS4zNCwyLjMsMi4zLDAsMCwxLDEuNDIsMS4zNmgwYTIuMzgsMi4zOCwwLDAsMS0uMTUsMmwtOC40MiwxNC45M2EyLjM0LDIuMzQsMCwwLDEtMiwxLjJabS0xLTIuOTJoMFptLTYuMjMtMTMuNDEsNy4xOCwxMS43Miw2Ljc3LTEyQTI1LjQ0LDI1LjQ0LDAsMCwwLDE0Mi40MiwyMzIuOFptLS43NS0xLjIyaDBabTE1LjQtLjMxaDBaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTQ4LjkzLDE2MS4xNmMtLjE1LS4zMS0xLS4zMS0xLjEyLDBMMTI3LDE5OS45M2MtLjE1LjI4LS4wNi4yNSwwLC4zNnMuMjIuMTguNTQuMThsMzUuMy4xOGMuMDcsMCwyLjY1LTMuODIsMi42Mi0zLjg5WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE2Mi45LDIwMi40MWgtLjA5bC0zNS4yNS0uMThhMi4yMywyLjIzLDAsMCwxLTItLjkyLDEuOSwxLjksMCwwLDEtLjEyLTIuMTlsMjAuNzktMzguOGEyLjI3LDIuMjcsMCwwLDEsMi4wOS0xLjEzaC4wNmEyLjI4LDIuMjgsMCwwLDEsMi4xLDEuMjNoMEwxNjcuMDcsMTk2Yy40OCwxLC4yNywxLjMyLTIuMzEsNUMxNjQuMjMsMjAxLjgsMTYzLjgsMjAyLjQxLDE2Mi45LDIwMi40MVptLTMzLjI1LTMuNjgsMzIuMzMuMTdjLjQ0LS42MywxLjA5LTEuNiwxLjUyLTIuMjVsLTE1LjIxLTMyLjcxWk0xNDkuMzYsMTYydjBaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTQ5Ljc4LDI5NC45YTM3LjEyLDM3LjEyLDAsMCwxLTE4LjI4LTQuODEsMzcuNDksMzcuNDksMCwwLDEtMTQuMjMtNTAuOTRBMzYuODgsMzYuODgsMCwwLDEsMTI2LDIyOC43M2EuNjEuNjEsMCwwLDAsLjEzLS44bC0xMS44Mi0xOS4yN2EuNjMuNjMsMCwwLDAtLjUyLS4zbC04LjY5LS4yNWEuNjUuNjUsMCwwLDAtLjU3LjMybC0xLjI5LDIuMjhhNC44Niw0Ljg2LDAsMCwxLTIuMywyLjE0LDQuNTgsNC41OCwwLDAsMS00LjA2LS4yM2wtLjA2LDBhNC44NCw0Ljg0LDAsMCwxLTIuMTMtMi4yOSw0LjU5LDQuNTksMCwwLDEsLjIzLTQuMDZsOC43OC0xNS41N2E0Ljc2LDQuNzYsMCwwLDEsMi4zLTIuMTEsNC42MSw0LjYxLDAsMCwxLDQsLjI0bC4yLjExYTQuNiw0LjYsMCwwLDEsMS43NSw2LjI2bC0xLjkzLDMuNDJhLjE1LjE1LDAsMCwwLC4xMy4yM2w1LjI1LjE2YTEsMSwwLDAsMCwuOS0uNTFsMjYuNjgtNDcuM2EuNjMuNjMsMCwwLDAtLjQxLS45MkwxMzcuMTUsMTQ5YTYuOCw2LjgsMCwwLDEtNC42NC0zLjQ0LDYuNDUsNi40NSwwLDAsMSwuMTItNi4xN2w2LjExLTEwLjhhMS4yMiwxLjIyLDAsMCwwLS40NC0xLjY1Yy0uNTctLjMzLTEuMDUtLjQ5LTEuNzUuNTZsLS4yMS4zNWE0LjQ4LDQuNDgsMCwwLDEtMS43LDEuNjUsNC4zNCw0LjM0LDAsMCwxLTQuNDItLjE2LDQuNDIsNC40MiwwLDAsMS0xLjMxLTYsMTQsMTQsMCwwLDEsMS4xNC0xLjYzbC40LS41MmMyLjcxLTMuNTMsNi43MS00LjQ1LDExLjI3LTIuNiw3Ljk1LDMuMjEsNy41Myw5LjIxLDUuNzcsMTMuNjhsLS4xLjIyLTMuMDUsNS40MWEyLDIsMCwwLDAsMS41NSwzTDE2OC4xLDE0M2MxLC4wOSwxLjMzLS4yNywxLjY5LTEuNDFsLjA2LS4xN2E1MS43Nyw1MS43NywwLDAsMSwzLTcsMzcuMzQsMzcuMzQsMCwwLDEsNjcuMjMsNC42MiwxLDEsMCwwLDAsMS45Mi0uMjEsOTEuNTQsOTEuNTQsMCwwLDAsMS4yMi0xNC4zMmMwLTYxLjIyLTUwLjg0LTExMS0xMTMuMzMtMTExUzE2LjYsNjMuMzIsMTYuNiwxMjQuNTNjMCw3MSwxMDEuMzcsMTk2LjU1LDEwNS42OSwyMDEuODZhOS45LDkuOSwwLDAsMCwxNS4yOSwwYzEuMjctMS41NiwxMC45NC0xMy41NiwyNC0zMS41YTEsMSwwLDAsMC0xLjA3LTEuNTZBMzcuNDMsMzcuNDMsMCwwLDEsMTQ5Ljc4LDI5NC45WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEyOS45MywzMzEuNzVhMTEuNTQsMTEuNTQsMCwwLDEtOS00LjI2Yy00LjMzLTUuMzItMTA2LjA4LTEzMS4yMy0xMDYuMDgtMjAzLDAtNjIuMTksNTEuNjMtMTEyLjc4LDExNS4wOC0xMTIuNzhTMjQ1LDYyLjM1LDI0NSwxMjQuNTNhOTMuNTksOTMuNTksMCwwLDEtMS4yNCwxNC41OSwyLjc1LDIuNzUsMCwwLDEtNS4yOC41OCwzNS41OSwzNS41OSwwLDAsMC02NC4wOC00LjQsNTAuMzQsNTAuMzQsMCwwLDAtMi45MSw2LjcybC0uMDUuMTZhMy4xNSwzLjE1LDAsMCwxLTMuNTEsMi42MWwtMjIuMjMtMi4xN2EzLjc1LDMuNzUsMCwwLDEtMi45LTUuNThsMy4wNy01LjQ3YzIuMTMtNS40OC41Ni05LjItNC44Mi0xMS4zNy0yLjY3LTEuMDgtNi40My0xLjYtOS4yMywybC0uNC41M2ExMi41MywxMi41MywwLDAsMC0xLDEuNDIsMi42NywyLjY3LDAsMCwwLC43MywzLjY5LDIuNTksMi41OSwwLDAsMCwyLjY3LjA5LDIuNzQsMi43NCwwLDAsMCwxLTFsLjIxLS4zNWMxLjEtMS42NywyLjU1LTIuMDYsNC4xMi0xLjE2YTMsMywwLDAsMSwxLjA5LDRsLTYuMTEsMTAuODFhNC42OSw0LjY5LDAsMCwwLS4wOSw0LjUxLDUuMDgsNS4wOCwwLDAsMCwzLjQ2LDIuNTNsNS40OSwxLjIxYTIuMzgsMi4zOCwwLDAsMSwxLjU2LDMuNDlMMTE3LjksMTk5LjM0YTIuNzgsMi43OCwwLDAsMS0yLjQ4LDEuNGwtNS4yNS0uMTZhMS45LDEuOSwwLDAsMS0xLjYtMi44M2wxLjkzLTMuNDNhMi44NSwyLjg1LDAsMCwwLTEuMDgtMy44OGwtLjItLjExYTIuODQsMi44NCwwLDAsMC0yLjUyLS4xNCwzLDMsMCwwLDAtMS40MywxLjM1bC04Ljc4LDE1LjU3YTIuODIsMi44MiwwLDAsMC0uMTQsMi41MiwzLjEsMy4xLDAsMCwwLDEuMzcsMS40NSwyLjg2LDIuODYsMCwwLDAsMi41OC4xNywzLjEzLDMuMTMsMCwwLDAsMS40NS0xLjM4bDEuMjktMi4yOGEyLjM5LDIuMzksMCwwLDEsMi0xLjIxaC4xN2w4LjY5LjI1YTIuMzcsMi4zNywwLDAsMSwyLDEuMTRMMTI3LjY1LDIyN2EyLjM4LDIuMzgsMCwwLDEtLjUxLDMuMDcsMzUuMTMsMzUuMTMsMCwwLDAtOC4zNCw5LjkyQTM1LjYyLDM1LjYyLDAsMCwwLDE2MCwyOTEuNjVhMi42OSwyLjY5LDAsMCwxLDMsMSwyLjc2LDIuNzYsMCwwLDEsMCwzLjIyYy0xMy4xNiwxOC4xNC0yMi45NSwzMC4yNS0yNCwzMS41N0ExMS41NSwxMS41NSwwLDAsMSwxMjkuOTMsMzMxLjc1Wm0wLTMxNi40OWMtNjEuNTMsMC0xMTEuNTgsNDktMTExLjU4LDEwOS4yOCwwLDI4LjgxLDE3LjYyLDcxLjksNTEsMTI0LjYxYTg3NC44Miw4NzQuODIsMCwwLDAsNTQuMzQsNzYuMTQsOC4xNSw4LjE1LDAsMCwwLDEyLjU4LDBjMS0xLjI3LDEwLjE5LTEyLjYsMjIuNjYtMjkuNzFhMzkuMTIsMzkuMTIsMCwwLDEtNDMuMTQtNTcuMjhBMzguNTgsMzguNTgsMCwwLDEsMTI0LjE2LDIyOGwtMTEtMTcuOTMtNy40MS0uMjEtMSwxLjdhNi42Myw2LjYzLDAsMCwxLTMuMTUsMi44OSw2LjMzLDYuMzMsMCwwLDEtNS42LS4zMkE2LjY2LDYuNjYsMCwwLDEsOTMuMTEsMjExYTYuMzQsNi4zNCwwLDAsMSwuMzItNS41OWw4Ljc4LTE1LjU3YTYuNTMsNi41MywwLDAsMSwzLjE2LTIuODcsNi4zNyw2LjM3LDAsMCwxLDUuNTYuMzNsLjIuMTFhNi4zNSw2LjM1LDAsMCwxLDIuNDIsOC42NWwtLjYzLDEuMTIsMi4xNS4wNywyNS43MS00NS41OC00LS44OUE4LjUsOC41LDAsMCwxLDEzMSwxNDYuNGE4LjI1LDguMjUsMCwwLDEsLjE2LTcuODJsNC4xOS03LjQyYTYuMDcsNi4wNywwLDAsMS02LS4zMiw2LjE1LDYuMTUsMCwwLDEtMS44OC04LjM3LDE1LjM2LDE1LjM2LDAsMCwxLDEuMjYtMS44MWwuMzktLjUxYzMuMi00LjE2LDguMDUtNS4zMSwxMy4zMy0zLjE4LDcuMTMsMi44OCw5LjU5LDguNjksNi43NCwxNS45NWwtLjIxLjQ0LTMuMDUsNS40MWEuMjUuMjUsMCwwLDAsLjE5LjM3bDIyLDIuMTUuMDYtLjE4LjA2LS4xOGE1Myw1MywwLDAsMSwzLjE5LTcuMzVBMzkuMDksMzkuMDksMCwwLDEsMjQwLjcsMTM2YTg2LjcsODYuNywwLDAsMCwuODItMTEuNDdDMjQxLjUxLDY0LjI4LDE5MS40NiwxNS4yNiwxMjkuOTMsMTUuMjZaTTExMi44NSwyMDkuNTdoMFptLTYuNzYtLjI5aDBaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTM0LjgxLDIyMi41YS42LjYsMCwwLDAsLjc0LjI0LDM2LjE1LDM2LjE1LDAsMCwxLDI3LjI5LS42MywxLDEsMCwwLDAsMS4xOS0uNDJsLjg4LTEuNTZhMSwxLDAsMCwwLS4xMy0xLjEzLDE2LjA1LDE2LjA1LDAsMCwxLTMuOTItOS4yMWMwLS4wOS0zMy45MS0uMzYtMzQtLjI1cy0uMTYuMDYsMCwuMzNaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTM1LjMzLDIyNC41NGEyLjM2LDIuMzYsMCwwLDEtMi0xLjExbC03LjkxLTEyLjYxYTEuODYsMS44NiwwLDAsMSwwLTIuMjZjLjQ4LS43OS43Ni0uNzksNi43My0uNzdsMTEuNTkuMDdjMTcsLjEzLDE3LjI3LjE5LDE3LjQ4LjI0bDEuMjUuMjkuMTEsMS4yOGExNC4zMywxNC4zMywwLDAsMCwzLjQ4LDguMTksMi43MywyLjczLDAsMCwxLC4zNCwzLjE1bC0uODgsMS41NWEyLjcsMi43LDAsMCwxLTMuMzQsMS4yLDM0LjE3LDM0LjE3LDAsMCwwLTI2LC42QTIuMywyLjMsMCwwLDEsMTM1LjMzLDIyNC41NFptLS40Ny0zLjRoMFptLTUtOS44Niw1Ljk0LDkuNDdhMzcuNjUsMzcuNjUsMCwwLDEsMjcuMDYtLjVsLjI3LS40OWExNy44NiwxNy44NiwwLDAsMS0zLjc5LTguMjVDMTU0LjIsMjExLjQzLDEzNi43MywyMTEuMjksMTI5Ljg0LDIxMS4yOVoiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yMTguNzQsMTMwLjE3YTI3LjEsMjcuMSwwLDAsMC0zNi44OCwxMC4yOCwyNS4xOSwyNS4xOSwwLDAsMC0xLjU5LDMuMTQsMS42NiwxLjY2LDAsMCwwLDAsMS4yMS40My40MywwLDAsMCwuMjMuMmwyMi45NSwxLjg0YzIuNDYuMTYsMy45MiwyLDMuNzksNC42NnMtMS45LDQuMy00Ljc0LDQuM2gtLjIzbC0yMy0xLjkySDE3OWEuNzUuNzUsMCwwLDAtLjQ1LjA5Ljg0Ljg0LDAsMCwwLS4xNy41MWMtLjI2LDguNzcsNS40LDE4LjE5LDEzLjc4LDIyLjkxQTI3LjExLDI3LjExLDAsMCwwLDIyOSwxNjcuMSwyNy4xOCwyNy4xOCwwLDAsMCwyMTguNzQsMTMwLjE3WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTIwNS4zOSwxODIuNjNhMjguNiwyOC42LDAsMCwxLTE0LjA5LTMuNzJjLTguOTItNS0xNS0xNS4xLTE0LjY3LTI0LjQ5YTIuNTQsMi41NCwwLDAsMSwuNzctMS43NywyLjM1LDIuMzUsMCwwLDEsMS42LS41M2wuNDQsMCwyMywxLjkyaC4wOWMxLjkzLDAsMi45MS0uODYsMy0yLjY0LjA2LTEuMjItLjI3LTIuNzEtMi4xNS0yLjgzbC0yMy4yMi0xLjg3LS4yMy0uMDlhMi4xOCwyLjE4LDAsMCwxLTEuMTItMSwzLjI5LDMuMjksMCwwLDEtLjE1LTIuNTksMjEsMjEsMCwwLDEsMS43NC0zLjQ5LDI4Ljg1LDI4Ljg1LDAsMCwxLDM5LjI2LTEwLjk1aDBhMjguOTQsMjguOTQsMCwwLDEsMTEsMzkuMzEsMjguNjMsMjguNjMsMCwwLDEtMTcuMzgsMTMuNTlBMjksMjksMCwwLDEsMjA1LjM5LDE4Mi42M1ptLTI1LjI2LTI2LjkxYy4yNyw3Ljc5LDUuNDMsMTUuOTQsMTIuODgsMjAuMTRhMjUuMzYsMjUuMzYsMCwwLDAsMzQuNS05LjYyLDI1LjQzLDI1LjQzLDAsMCwwLTkuNjMtMzQuNTRoMGEyNS4zNSwyNS4zNSwwLDAsMC0zNC40OSw5LjYyYy0uNTYsMS0uOTEsMS42NS0xLjEyLDIuMDdsMjEuMzIsMS43MWMzLjM5LjIyLDUuNTcsMi44Myw1LjM5LDYuNDlzLTIuODQsNi4xMS02Ljc5LDZaIi8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTIzLjc4LDI2NC45MWEyNy4wNywyNy4wNywwLDEsMCw0My43Ny0yNy43NUEuNjUuNjUsMCwwLDAsMTY3LDIzN2EuNTcuNTcsMCwwLDAtLjQxLjI5bC05LDE1LjkzYTkuMDgsOS4wOCwwLDAsMS0xNS42NS4yOWwtOS41Ny0xNS41OWEuNTkuNTksMCwwLDAtLjQzLS4yOGgtLjA5YS42My42MywwLDAsMC0uNDQuMTgsMjcsMjcsMCwwLDAtNy42NCwyNy4wOVoiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNDkuOCwyODYuNDdhMjguNzcsMjguNzcsMCwwLDEtMjcuNy0yMS4wOWgwYTI4Ljc4LDI4Ljc4LDAsMCwxLDguMTQtMjguODUsMi4zOCwyLjM4LDAsMCwxLDEuNjMtLjY0bC4zLDBhMi4zNiwyLjM2LDAsMCwxLDEuNzEsMS4xbDkuNTcsMTUuNTlhNy4zMyw3LjMzLDAsMCwwLDEyLjYzLS4yM2w5LTE1LjkzYTIuMzMsMi4zMywwLDAsMSwxLjYzLTEuMTYsMi40LDIuNCwwLDAsMSwyLC41NiwyOC44MiwyOC44MiwwLDAsMS0xOC45LDUwLjYzWm0tMjQuMzMtMjJhMjUuMzIsMjUuMzIsMCwxLDAsNDEuOTQtMjVsLTguMjksMTQuNjlhMTAuODMsMTAuODMsMCwwLDEtMTguNjYuMzVsLTguODItMTQuMzdhMjUuMjksMjUuMjksMCwwLDAtNi4xNywyNC4zOFptNy4xNS0yNS4zNGgwWm0zMy43OS0uNjFoMFptMS43LS4zM2gwWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE5MCwxODcuMzNhMzgsMzgsMCwwLDEtMjEuOTEtMzMuMjEsMi4xOSwyLjE5LDAsMCwwLS4wOS0uNjVsLTEwLjYzLS44Yy0uNCwwLS41MS4xNi0uNTYuMjRhMS40NiwxLjQ2LDAsMCwwLDAsMS4zNGwxNy4zNSwzNy44MWExLDEsMCwwLDAsMSwuNTYsMTYuNjksMTYuNjksMCwwLDEsMTMuOCwzLjk0LDE1LjUzLDE1LjUzLDAsMCwxLDQuNzgsMTUuMDgsMTYuMTYsMTYuMTYsMCwwLDEtMTguNjcsMTIuNTEsMSwxLDAsMCwwLTEsLjQ3bC0uODgsMS41NmExLDEsMCwwLDAsLjI2LDEuMjQsMzYuMzcsMzYuMzcsMCwwLDEsMTMuNzQsMjUuNjcsMSwxLDAsMCwwLDEuNzcuNDRjMTMuNTctMjEuMDksMjcuMjctNDQuNzYsMzcuMzItNjcuNjVhMSwxLDAsMCwwLTEuNDEtMS4xOUEzNi40MiwzNi40MiwwLDAsMSwxOTAsMTg3LjMzWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE4OC4xMiwyNTUuNzFhMi43NCwyLjc0LDAsMCwxLS42Ni0uMDgsMi43MSwyLjcxLDAsMCwxLTItMi40LDM0LjY4LDM0LjY4LDAsMCwwLTEzLjA3LTI0LjQzLDIuNywyLjcsMCwwLDEtLjctMy40OGwuODgtMS41NmEyLjc0LDIuNzQsMCwwLDEsMi44Ny0xLjMzQTE0LjMzLDE0LjMzLDAsMCwwLDE5MiwyMTEuMjZhMTMuNzcsMTMuNzcsMCwwLDAtNC4yLTEzLjM3LDE1LDE1LDAsMCwwLTEyLjQ2LTMuNTQsMi43MiwyLjcyLDAsMCwxLTIuODMtMS41OEwxNTUuMjEsMTU1YTMuMTgsMy4xOCwwLDAsMSwuMTYtMywyLjI2LDIuMjYsMCwwLDEsMi0xaC4xbDEwLjc1LjgxYy43Mi4xLDEuNTcuNTksMS41OSwyLjM2YTM2LjI4LDM2LjI4LDAsMCwwLDIwLjg5LDMxLjY0LDM0Ljg0LDM0Ljg0LDAsMCwwLDMzLjE0LTIuNTQsMi43MiwyLjcyLDAsMCwxLDQsMy4zN2MtOC44NywyMC4yMi0yMS40Nyw0My4wNi0zNy40NSw2Ny45QTIuNzEsMi43MSwwLDAsMSwxODguMTIsMjU1LjcxWk0xNzUsMjI2LjQ1YTM4LjE2LDM4LjE2LDAsMCwxLDEzLjYzLDI0LjI2YzE0LjcyLTIzLDI2LjQ4LTQ0LjMsMzUtNjMuMjhhMzguMzQsMzguMzQsMCwwLDEtMzQuMzUsMS40OWgwYTM5LjksMzkuOSwwLDAsMS0yMi45LTMzLjgybC03LjUzLS41NiwxNi42NSwzNi4yOGExOC4zNCwxOC4zNCwwLDAsMSwxNC41OSw0LjRBMTcuMzEsMTcuMzEsMCwwLDEsMTk1LjQ2LDIxMiwxNy44MiwxNy44MiwwLDAsMSwxNzUuMywyMjZabS43Mi0zNS4xM2gwWiIvPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTE3Mi43OSwyMTRhNi45NSw2Ljk1LDAsMSwwLDguOC0xMC43Niw2Ljk1LDYuOTUsMCwxLDAtOC44LDEwLjc2WiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE3Ny4xNywyMTcuMzVhOC43Myw4LjczLDAsMCwxLTUuNDgtMmgwYTguNjQsOC42NCwwLDEsMSw1LjQ4LDJabS0zLjI5LTQuNjlhNS4yLDUuMiwwLDEsMC0xLjYtNS43NCw1LjE5LDUuMTksMCwwLDAsMS42LDUuNzRaIi8+PC9zdmc+);
    width: 2.25rem;
    height: 3rem;
    position: absolute;
    top: 0;
    left: 0;
  }

  a {
    color: $c-main;
    text-decoration: none;
  }

  @include desktop() {
    display: inline-block;
    padding-left: 3.7rem;
    font-size: 2.75rem;
    line-height: 2.75rem;

    &::before {
      width: 71px;
      height: 94px;
      top: -1.5rem;
    }
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

      &.active {
        text-decoration: underline;
      }
    }
  }

  @include desktop() {
    display: inline-block;
    margin-bottom: 0;
    margin-left: 2rem;
    padding-left: 0;

    ul {

      li {
        display: inline;
        margin-right: 1rem;

        a {
          font-size: 1rem;
        }
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
  background-image: linear-gradient(to right,  $c-highlight 0%, $c-highlight 49%, $c-main 50%, $c-main 100%);
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
    height: 3px;
    background-size: 10% 100%;
    animation: stripe 10s infinite linear;
  }
  .burger {
    display: none;
  }
}

.msg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #333;
  padding: .5rem 0;
  color: #fff;
  text-align: center;
}

</style>
