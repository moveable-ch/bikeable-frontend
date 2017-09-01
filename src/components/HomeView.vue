<template>
  <div class="home">
    <div class="home__intro" v-if="!isLoggedIn">
      <div class="container">
        <div class="home__intro__illu">
          <img src="/static/img/paul.png" alt="Bikeapaul">
        </div>
        <div class="home__intro__content">
          <h1>Let's make Zürich bikeable.</h1>
          <p>Bikeable.ch zeigt die gefährlichsten Spots für Velofahrer auf und hilft bei der Lösungsfindung.</p>
          <a href="#" class="home__intro__cta">Jetzt registrieren</a>
        </div>
      </div>
    </div>

    <div class="home__spots">
      <div class="container">
        <h2>Hot Spots in Zürich</h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home-view',
  metaInfo: {
    title: 'Bikeable'
  },
  props: [],
  computed: {
    entries() {
      return this.$store.state.entries;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userCoords() {
      return this.$store.state.userCoords;
    }
  },
  data() {
    return {
    }
  },
  watch: {
  },
  methods: {

  },
  mounted() {
    this.$store.dispatch('loadEntries');
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.home {

  &__spots {
    margin: 2rem 0;
  }

  &__intro {
    background-color: #FAF8DB;
    background-image: url('../assets/home-bg.png');
    background-size: cover;
    height: 650px;
    color: #444;
    margin-top: -7rem;

    @include desktop() {
      height: 800px;
    }

    &__content {
      padding-top: 300px;

      @include desktop() {
        padding-top: 450px;
      }
    }
    &__illu {
      position: absolute;
      top: 7rem;
      left: 50%;
      width: 9rem;
      margin-left: -4.5rem;
      transform-origin: 50% 100%;
      opacity: 0;
      animation: paul 3s $easeOutQuint .5s 1 normal forwards;

      img {
        width: 100%;
        height: auto;
      }

      @include desktop() {
        top: 2.5rem;
        width: 14rem;
        margin-left: -7rem;
      }
    }
    &__cta {
      display: block;
      margin: 2rem auto;
      width: 13rem;
      background-color: transparent;
      border: 4px solid $c-main;
      text-align: center;
      color: $c-main;
      font-family: $f-head;
      font-weight: bold;
      padding: 1rem 0;
      text-decoration: none;

      &:hover {
        border-color: #444;
        color: #444;
        // background-color: #fff;
      }
    }
    h1 {
      color: #444;
      margin: 0;
      font-weight: bold;
      font-size: 2.25rem;
      line-height: 1.3;
      margin-bottom: 1rem;
      text-align: center;
    }
    p {
      font-size: 1rem;
      line-height: 1.6;
      color: #444;
      max-width: 550px;
      margin: 0 auto;
      text-align: center;

      a {
        color: #444;
      }
    }
  }
}

@keyframes paul {
  from {
    opacity: 0;
    transform: rotate(2deg) translate(200px, -200px) scale(.6);
  }
  to {
    opacity: 1;
    transform: rotate(0deg) translate(0, 0) scale(1);
  }
}

</style>
