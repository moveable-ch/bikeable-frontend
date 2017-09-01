<template>
  <div class="home">
    <div class="home__intro" v-if="!isLoggedIn">
      <div class="container">
        <div class="home__intro__illu">
          <img src="/static/img/paul.png" alt="Bikeapaul">
        </div>
        <div class="home__intro__content">
          <h1>Let's make <a href="#">Zürich</a> bikeable.</h1>
          <p>Bikeable.ch zeigt die gefährlichsten Spots für Velofahrer auf und hilft bei der Lösungsfindung.</p>
          <router-link to="/register" class="home__intro__cta">Jetzt registrieren</router-link>
        </div>
      </div>
    </div>

    <div class="home__spots">
      <div class="container">
        <h2>Hot Spots in Zürich</h2>
        <div class="home__spots__container">
          <router-link :to="'/entries/' + spot._id" class="home__spots__item" v-for="spot in topSpots" v-bind:class="{ famed: spot.famed }">
            <span class="home__spots__image" :style="'background-image: url(' + spot.photo.medium.url + ')'"></span>
            <h3>{{ spot.title }}</h3>
            <span class="address">{{ spot.address }}</span>
          </router-link>
        </div>
        <router-link to="/entries" class="btn-centered">Alle Spots anzeigen</router-link>
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
    },
    topSpots() {
      if(!this.entries) return;

      let e = this.entries.sort(function(a,b) {
        return b.votes - a.votes;
      });
      return e.slice(0, 3);
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
    margin: 4rem 0;

    &__container {
      margin-top: 2rem;
      display: flex;
      justify-content: space-between;
    }
    &__item {
      display: block;
      text-decoration: none;
      width: calc(33.3% - 1rem);
      position: relative;

      &:hover {
        .home__spots__image::after {
          transform: scale(1.1);
        }
        h3 {
          color: $c-highlight;
        }
      }
      &.famed:hover {
        h3 {
          color: $c-main;
        }
      }
    }
    &__image {
      display: block;
      width: 100%;
      height: 0;
      padding-bottom: 70%;
      background-size: cover;
      background-position: center;
      position: relative;

      &::after {
        content: "";
        display: block;
        width: 61px;
        height: 61px;
        background-size: 100%;
        position: absolute;
        bottom: -10px;
        right: -10px;
        background-image: url('../assets/thumbs-down.png');
        transition: .2s transform $easeOutQuint;
      }

      .famed & {
        &::after {
          background-image: url('../assets/thumbs-up.png');
        }
      }
    }
    h3 {
      color: #444;
      font-size: 1.25rem;
      line-height: 1.2;
      margin-top: 1rem;
      margin-bottom: .5rem;
      hyphens: auto;
    }
    .address {
      display: block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: .9rem;
      color: #888;
    }
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
      transform-origin: center bottom;
      animation: paul .7s ease-out 0s infinite normal forwards;

      img {
        width: 100%;
        height: auto;
      }

      @include desktop() {
        top: 3.5rem;
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

      a {
        color: #444;
      }
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
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: scale(1, 1.01) translateY(-2px) rotate(-1deg);
  }
  75% {
    transform: scale(1, .99) rotate(1.5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

</style>
