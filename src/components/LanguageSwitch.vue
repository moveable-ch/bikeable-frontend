<template>
  <div class="langswitch" v-bind:class="{ flipped: flipped }">
    <a href="#" class="langswitch__current" @click.prevent="switcherVisible = !switcherVisible">{{ currentLang }}</a>
    <transition name="switcher-anim">
      <div class="langswitch__switcher" v-if="switcherVisible">
        <ul>
          <li v-for="lang in languages" v-bind:key="lang.code"><a href="#" @click.prevent="setLang(lang.code)">{{ lang.name }}</a></li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
  name: 'language-switch',
  props: ['flipped'],
  data () {
    return {
      switcherVisible: false
    }
  },
  computed: {
    currentLang() {
      return this.$store.getters.lang;
    },
    languages() {
      return this.$store.getters.languages;
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    setLang(lang) {
      this.switcherVisible = false;

      this.$store.dispatch('setLang', lang)
      .then((data) => {
        }, (data) => {
          this.$store.dispatch('handleError', 'Error');
        });
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.langswitch {
  display: inline-block;
  position: relative;

  &__current {
    text-transform: uppercase;
    position: relative;
    padding-right: 15px;

    &::after {
      content: "";
      display: block;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #869098;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    &:hover::after {
      border-top: 5px solid $c-black;
    }
  }

  &__switcher {
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    background-color: #fff;
    width: 100px;
    padding: 1rem 1.5rem;
    border-radius: 4px;
    box-shadow: 0 4px 30px -5px rgba(#000, .1);
    transform: translateX(-50%);

    .flipped & {
      top: auto;
      bottom: calc(100% + 10px);

      &::before {
        border-bottom: 5px solid transparent;
        border-top: 5px solid white;
        top: auto;
        bottom: -10px;
      }
    }

    &::before {
      content: "";
      display: block;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid white;
      position: absolute;
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
    }

    ul {
      li {
        display: block;
        line-height: 1;
        text-align: center;
        margin: .5rem 0;

        a {
          line-height: 1;
        }
      }
    }
  }
}

.switcher-anim-enter-active, .switcher-anim-leave-active {
  transition: opacity .4s $easeOutQuint, transform .4s $easeOutQuint;
}
.switcher-anim-enter {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
.switcher-anim-enter-to {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.switcher-anim-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

</style>
