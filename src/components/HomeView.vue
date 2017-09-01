<template>
  <div class="home">
    <div class="home__intro">
      <div class="container">
        <div class="home__intro__content">
          <h1>Let's make Zürich<br><strong>Bikeable</strong></h1>
          <p>Bikeable.ch zeigt die gefährlichsten Spots für Velofahrer auf und hilft bei der Lösungsfindung.</p>
          <p>Jetzt registrieren und mitdiskutieren!</p>
        </div>
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

  &__intro {
    background-color: $c-main;
    height: 80vh;
    min-height: 400px;
    max-height: 800px;
    color: #fff;

    &__content {
      padding-top: 6rem;
    }
    h1 {
      color: #fff;
      margin: 0;
      font-weight: 400;
      font-size: 4rem;
      line-height: 1.3;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.25rem;
      color: #fff;
      max-width: 550px;
    }
  }
}

</style>
