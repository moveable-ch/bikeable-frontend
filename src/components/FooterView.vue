<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__col footer__col--left">
          <ul>
            <li>bikeable</li>
            <li><a href="/">info@bikeable.ch</a></li>
          </ul>
        </div>
        <div class="footer__col footer__col--center">
          <img class="footer__logo" src="/static/img/bikeable-logo.svg" alt="bikeable">
        </div>
        <div class="footer__col footer__col--right">
          <ul>
            <li><router-link to="/about" exact>About</router-link></li>
            <li><router-link to="/faq" exact>FAQ</router-link></li>
            <li><router-link to="/partner" exact>Partner</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'header-view',
  data () {
    return {
    }
  },

  methods: {

  },

  computed: {
  },

  watch: {
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.footer {
  background-color: $c-main;
  padding: 2rem 0;
  margin-top: 2rem;
  width: 100%;
  color: #fff;
  text-align: center;

  &__inner {
    display: flex;
    flex-wrap: wrap;
  }
  &__col {
    width: 100%;
    padding: 0 2rem;
    box-sizing: border-box;
    position: relative;
    &--center {
      text-align: center;
      display: none;
    }
  }
  &__logo {
    width: 8rem;
    position: absolute;
    top: -3.5rem;
    left: 50%;
    margin-left: -4rem;
  }
  ul {
    li {
      margin: 1rem 0;

      a {
        color: inherit;
        text-decoration: none;
        box-shadow: inset 0 -1px 0 0 #fff;

        &:hover {
          color: $c-highlight;
          box-shadow: inset 0 -1px 0 0 $c-highlight;
        }
      }
    }
  }

  @include desktop {
    padding: 1.5rem 0;
    margin-top: 8rem;

    &__col {
      width: 40%;

      &--left {
        ul li {
          text-align: right;
        }
      }
      &--right {
        ul li {
          text-align: left;
        }
      }
      &--center {
        width: 20%;
        display: block;
      }
    }
  }
}

</style>
