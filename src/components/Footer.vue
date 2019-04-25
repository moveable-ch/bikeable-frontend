<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__col footer__col--left">
          <ul>
            <li><strong>bikeable.ch</strong></li>
            <li><a href="mailto:info@bikeable.ch">info@bikeable.ch</a></li>
            <li><router-link to="/about" exact>About</router-link></li>
          </ul>
        </div>
        <div class="footer__col footer__col--center">
          <img class="footer__logo" src="/static/img/bikeable-logo-gr.svg" alt="bikeable">
        </div>
        <div class="footer__col footer__col--right">
          <ul>
            <li><router-link to="/news">News</router-link></li>
            <li><router-link to="/faq" exact>FAQ</router-link></li>
            <li><router-link to="/partner" exact>{{ $t('partner.partner') }}</router-link></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="partner">
      <div class="container">
        <span>{{ $t('footer.supported') }}</span>
        <div class="partner__logos">
          <a target="_blank" href="https://www.veloplus.ch"><img src="/static/img/veloplus-footer.png" alt="veloplus.ch"></a>
          <a target="_blank" v-if="currentLang != 'fr'" href="https://www.pro-velo.ch"><img src="/static/img/provelo-footer.png" alt="provelo.ch"></a>
          <a target="_blank" v-if="currentLang == 'fr'" href="https://www.pro-velo.ch"><img src="/static/img/provelo-footer-fr.png" alt="provelo.ch"></a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'c-footer',
  data () {
    return {
    }
  },

  methods: {

  },

  computed: {
    currentLang() {
      return this.$store.getters.lang;
    }
  },

  watch: {
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.footer {
  background-color: $c-grey;
  padding: 1.5rem 0 0 0;
  margin-top: 1rem;
  width: 100%;
  color: #000;
  text-align: center;
  border-bottom: 1px solid $c-grey-dark;
  border-top: 1px solid $c-grey-dark;

  strong {
    font-weight: 700;
  }

  &__inner {
    display: flex;
    flex-wrap: wrap;
  }
  &__col {
    width: 100%;
    padding: 0rem;
    box-sizing: border-box;
    position: relative;
    &--center {
      text-align: center;
      display: none;
    }
  }
  &__logo {
    width: 5rem;
    position: absolute;
    top: -1rem;
    left: 50%;
    margin-left: -2.5rem;
  }
  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      margin: .5rem 0;
      width: 50%;
      text-align: left;

      a {
        color: inherit;
        text-decoration: none;
        // box-shadow: inset 0 -1px 0 0 #fff;

        &:hover {
          color: $c-main;
          // box-shadow: inset 0 -1px 0 0 $c-highlight;
        }
      }
    }
  }

  .partner {
    background-color: $c-blue;
    padding: 3rem 0;
    margin-top: 1.5rem;
    color: #000;

    &__logos {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    span {
      font-size: .8rem;
    }
    a {
      display: block;
      max-width: 150px;
      margin: .5rem 1rem;

      img {
        width: 100%;
        height: auto;
      }
      &:hover {
        img {
          opacity: .8;
        }
      }
    }
  }

  @include tablet {
    padding: 2rem 0 0 0;
    margin-top: 8rem;

    &__col {
      width: 40%;

      ul {
        display: block;

        li {
          width: 100%;
          margin: 1rem 0;
        }
      }

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
