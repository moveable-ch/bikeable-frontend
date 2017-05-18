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
  background-color: #fff;
  padding: 2rem 0;
  margin-top: 2rem;
  width: 100%;
  color: $c-main;
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
    top: -4.5rem;
    left: 50%;
    margin-left: -4rem;
  }
  ul {
    li {
      margin: 1rem 0;

      a {
        color: $c-main;

        &:hover {
          color: $c-highlight;
        }
      }
    }
  }

  @include desktop {
    padding: 3rem 0;
    margin-top: 8rem;

    &__col {
      width: 33.3%;

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
        display: block;
      }
    }
  }
}

</style>
