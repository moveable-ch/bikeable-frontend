<template>
  <div class="home">
    <div class="home__intro" v-if="!isLoggedIn">
      <div class="container">
        <div class="home__intro__path">
          <svg width="961px" height="689px" viewBox="0 0 961 689" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Artboard" transform="translate(-75.000000, 0.000000)" stroke="#FE0094" stroke-width="2" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-dasharray="10,20">
              <path d="M893,688 C943,648 976,622 992,610 C1016,592 1040,521 1033,486 C1026,451 969,370 841,390 C713,410 687,475 548,540 C409,605 165,567 105,452 C45,337 81,209 194,153 C307,97 484,135 544,166 C604,197 675,222 723,183 C771,144 752,118 753,109 C754,100 735,80 716,68 C697,56 635,40 634,0 C633.333333,-26.6666667 647.666667,-39.3333333 677,-38" id="bikepath"></path>
            </g>
          </svg>
        </div>
        <div class="home__intro__illu">
          <img src="/static/img/paul.png" alt="Bikeapaul">
        </div>
        <div class="home__intro__content">
          <h1>Let's make<br>Your City<br>bikeable!</h1>
          <!--<p>Bikeable.ch zeigt die gefährlichsten Spots für Velofahrer auf und hilft bei der Lösungsfindung.</p>-->
          <router-link to="/register" class="home__intro__cta">Jetzt registrieren</router-link>
        </div>
      </div>
    </div>

    <div class="home__spots">
      <div class="container">
        <h2>Hot Spots in Zürich</h2>
        <div class="home__spots__container">
          <router-link :to="'/entries/' + spot._id" class="home__spots__item" v-for="spot in topSpots" :key="spot._id" v-bind:class="{ famed: spot.famed }">
            <span class="home__spots__image" :style="'background-image: url(' + spot.photo.medium.url + ')'"></span>
            <h3>{{ spot.title }}</h3>
            <span class="address">{{ spot.address }}</span>
          </router-link>
        </div>
        <router-link to="/entries" class="btn-centered">Alle Spots anzeigen</router-link>
      </div>
    </div>

    <div class="home__spots">
      <div class="container">
        <h2>New Spots in Zürich</h2>
        <div class="home__spots__container">
          <router-link :to="'/entries/' + spot._id" class="home__spots__item" v-for="spot in topSpots" :key="spot._id" v-bind:class="{ famed: spot.famed }">
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
    },
    newSpots() {
      // return this.entries;
      if(!this.entries) return;

      let e = this.entries.sort(function(a,b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
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
    margin: 3rem 0;

    @include desktop() {
      margin: 4rem 0;
    }

    &__container {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    &__item {
      display: block;
      text-decoration: none;
      width: 100%;
      max-width: 300px;
      margin-bottom: 2rem;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      background-color: #fafafa;
      padding-bottom: 1.5rem;
      transition: .4s box-shadow $easeOutQuint;
      box-shadow: 0 5px 5px 0 rgba(#000, 0);

      @include desktop() {
        width: calc(33.3% - 1rem);
        max-width: none;
        margin-left: 0;
        margin-right: 0;
      }

      &:hover {
        // background-color: #f0f0f0;
        // box-shadow: 0 5px 20px 0 rgba(#000, .06);

        .home__spots__image::after {
          transform: rotate(15deg);
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
      font-family: $f-body;
      padding: 0 1rem;
      text-transform: none;
      font-size: 1rem;
      margin-top: 1rem;
      color: #333;
      line-height: 1.2;
      margin-bottom: .5rem;
    }
    .address {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: .75rem;
      color: #333;
      padding: 0 1rem;
    }
  }

  &__intro {
    // background-image: linear-gradient(-180deg, $c-yellow 58%, $c-white 100%);
    background-color: $c-yellow;
    height: 350px;
    max-width: 1200px;
    margin: 0 auto;
    color: #444;
    // overflow: hidden;
    position: relative;
    margin-top: -3rem;
    padding-top: 3rem;

    @include desktop() {
      height: 650px;
      margin-top: 0;
      padding-top: 0;
    }

    &__content {
      padding-top: 1rem;

      @include desktop() {
        padding-top: 4rem;
      }
    }
    &__path {
      position: absolute;
      right: 13rem;
      top: -6rem;
      width: 961px;
      height: 691px;
      pointer-events: none;
      // padding-bottom: 58%;

      svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      #bikepath {
        stroke-dasharray: 10, 20;
        animation: bikedash 1s linear infinite;
      }

      @media screen and (max-width: 1130px) {
        right: 0rem;
      }
      @media screen and (max-width: 700px) {
        top: -.5rem;
        right: -.5rem;
        width: 36rem;
        height: 24rem;
      }
    }
    &__illu {
      position: absolute;
      top: 6.2rem;
      right: 12rem;
      width: 19rem;
      transform-origin: center bottom;
      animation: paul .7s ease-out 0s infinite normal forwards;

      @media screen and (max-width: 1130px) {
        right: 0rem;
      }
      @media screen and (max-width: 700px) {
        width: 12rem;
        z-index: 1;
        top: 9.75rem;
        right: 1rem;
      }

      img {
        width: 100%;
        height: auto;
      }
    }
    &__cta {
      font-family: $f-body;
      text-decoration: none;
      margin-left: 1rem;
      font-weight: 400;

      &::before {
        content: "→";
        margin-right: .5rem;
      }
    }
    h1 {
      color: $c-main;
      margin: 0;
      font-weight: bold;
      font-size: 2.75rem;
      line-height: .9;
      margin-bottom: 1rem;
      transform-origin: 0% 0%;
      transform: skew(0, -4deg);
      opacity: 0;
      animation: headline 1s ease-out .3s 1 normal forwards;

      a {
        color: $c-main;
      }

      @include desktop() {
        font-size: 4.25rem;
      }
    }
    p {
      font-size: 1.1rem;
      line-height: 1.7;
      color: $c-main;
      max-width: 600px;

      a {
        color: #444;
      }

      @include desktop() {
        font-size: 1.3rem;
      }
    }
  }
}

@keyframes paul {
  0% {
    transform: rotate(0deg) translateY(0);
  }
  25% {
    transform: rotate(.5deg) translateY(2px);
  }
  75% {
    transform: rotate(-.5deg) translateY(-2px);
  }
  100% {
    transform: rotate(0deg) translateY(0);
  }
}

@keyframes bikedash {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 30;
  }
}

@keyframes headline {
  0% {
    transform: translateY(40px) skew(0, -4deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0) skew(0, -4deg);
    opacity: 1;
  }
}

</style>
