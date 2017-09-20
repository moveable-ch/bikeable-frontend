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
          <h1>Let's make<br>our cities<br>bikeable!</h1>
          <!--<p>Bikeable.ch zeigt die gefährlichsten Spots für Velofahrer auf und hilft bei der Lösungsfindung.</p>-->
          <router-link to="/register" class="home__intro__cta">Jetzt registrieren</router-link>
        </div>
      </div>
    </div>

    <div class="home__spots">
      <div class="container">
        <h2>Hot Spots</h2>
        <div class="home__spots__container">
          <router-link :to="'/entries/' + spot._id" class="home__spots__item" v-for="spot in topSpots" :key="spot._id" v-bind:class="{ famed: spot.famed }">
            <span class="home__spots__image" :style="'background-image: url(' + spot.photo.medium.url + ')'"></span>
            <span class="home__spots__content">
              <h3>{{ spot.title }}</h3>
              <span class="address">{{ spot.address }}</span>
              <span class="meta">{{ spot.votes }} Votes</span>
            </span>
          </router-link>
        </div>
        <router-link to="/entries" class="home__spots__button">Alle Spots anzeigen</router-link>
      </div>
    </div>

    <div class="home__spots">
      <div class="container">
        <h2>New Spots</h2>
        <div class="home__spots__container">
          <router-link :to="'/entries/' + spot._id" class="home__spots__item" v-for="spot in newSpots" :key="spot._id" v-bind:class="{ famed: spot.famed }">
            <span class="home__spots__image" :style="'background-image: url(' + spot.photo.medium.url + ')'"></span>
            <span class="home__spots__content">
              <h3>{{ spot.title }}</h3>
              <span class="address">{{ spot.address }}</span>
              <span class="meta">{{ formatDate(spot.createdAt) }}</span>
            </span>
          </router-link>
        </div>
        <router-link to="/entries" class="home__spots__button">Alle Spots anzeigen</router-link>
      </div>
    </div>

    <div class="home__news">
      <div class="container">
        <h2>Bikeable News</h2>
        <div class="home__news__container">
          <div class="home__news__item" v-for="article in news">
            <router-link :to="'/news/' + article.id"><img class="home__news__image" :src="article.image"></router-link>
            <div class="home__news__content">
              <h3><router-link :to="'/news/' + article.id">{{ article.title }}</router-link></h3>
              <p>{{ article.abstract }}</p>
              <router-link class="home__news__more" :to="'/news/' + article.id">Mehr</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Prismic from 'prismic.io';
import spots from '../api/spots';

export default {
  name: 'v-home',
  metaInfo: {
    title: 'Bikeable'
  },
  props: [],
  computed: {
    entries() {
      return this.$store.getters.allSpots;
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
      news: {},
      newSpots: [],
      topSpots: []
    }
  },
  watch: {
  },
  methods: {

    loadNews() {
      this.$store.commit('LOAD_START');

      this.fetchNews().then(data => {
        this.news = data;
        this.$store.commit('LOAD_FINISH');
      });
    },

    loadSpots() {
      this.$store.commit('LOAD_START');

      spots.getAllSpots({
          limit: 3,
          sort: 'votes'
        })
        .then((entries) => {
          this.$store.commit('LOAD_FINISH');
          this.topSpots = entries;
        },
        (error) => {
          this.$store.commit('LOAD_FINISH');
          this.$store.dispatch('handleError', 'Fehler');
        });

      spots.getAllSpots({
          limit: 3,
          sort: 'date'
        })
        .then((entries) => {
          this.$store.commit('LOAD_FINISH');
          this.newSpots = entries;
        },
        (error) => {
          this.$store.commit('LOAD_FINISH');
          this.$store.dispatch('handleError', 'Fehler');
        });
    },

    fetchNews() {
      return Prismic.api("https://bikeable.prismic.io/api").then(function(api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'news'),
          {}
        );
      }).then(function(payload) {
        const y = [];
        y.questions = payload.results.slice(0,3).map((x) => {
          const z = {};
          z.id = x.id;
          z.title = x.getText('news.news_title');
          z.abstract = x.getText('news.news_abstract');
          z.image = x.getImage('news.news_image').views.preview.url;
          y.push(z);
        });
        return y;
      }, function(err) {
        console.log("Something went wrong: ", err);
      });
    },

    formatDate(date) {
      if(!date) return '';
      let d = new Date(date);
      return d.toLocaleDateString('de-DE');
    }
  },
  mounted() {
    this.$store.dispatch('getAllSpots');
    this.loadNews();
    this.loadSpots();
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.home {

  &__news {
    margin: 3rem 0;

    @include desktop() {
      margin: 4rem 0;
    }

    &__container {
      margin-top: 2rem;

      @include desktop() {
        margin-top: 3rem;
      }
    }

    &__item {
      display: flex;
      margin-top: 1rem;

      @include desktop() {
        max-width: 850px;
      }
    }

    &__more {
      display: inline-block;
      font-size: .9rem;
      margin-top: 1rem;
    }

    &__content {
      padding-left: 1rem;
      padding-top: 0;

      h3 {
        line-height: 1.1;
        font-size: 1.25rem;
        margin-bottom: .5rem;

        a {
          text-decoration: none;
        }
      }

      p {
        font-size: .9rem;
      }

      @include desktop() {
        padding-left: 1.5rem;
        padding-top: 0;
      }
    }

    &__image {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      box-shadow: 2px 2px 0 0 $c-grey-dark;

      @include desktop() {
        width: 200px;
        height: 200px;
      }
    }
  }

  &__spots {
    margin: 3rem 0;

    @include desktop() {
      margin: 4rem 0 5rem 0;
    }

    &__container {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
    }
    &__button {
      text-decoration: none;
      font-weight: 500;

      &::before {
        content: "→";
        margin-right: .5rem;
        // color: #aaa;
      }
    }
    &__item {
      display: flex;
      text-decoration: none;
      width: 100%;
      // max-width: 300px;
      margin-bottom: 2rem;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      // background-color: $c-grey;
      transition: .4s box-shadow $easeOutQuint;
      box-shadow: 0 5px 5px 0 rgba(#000, 0);

      @include desktop() {
        width: calc(33.3% - 1rem);
        // padding-bottom: 1.5rem;
        max-width: none;
        margin-left: 0;
        margin-right: 0;
        flex-wrap: wrap;
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
    &__content {
      display: block;
      width: 60%;
      padding-left: 1rem;
      overflow: hidden;

      @include desktop {
        width: 100%;
        padding: 1rem 1rem 0 0;
      }
    }
    &__image {
      display: block;
      width: 35%;
      flex-shrink: 0;
      height: 0;
      padding-bottom: 30%;
      background-size: cover;
      background-position: center;
      position: relative;

      @include desktop() {
        width: 100%;
        padding-bottom: 70%;
      }

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
      text-transform: none;
      font-size: 1.25rem;
      color: $c-black;
      line-height: 1.2;
      margin-bottom: .2rem;
    }
    .address {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: .9rem;
      color: $c-black;

      @include desktop() {
        font-size: .75rem;
      }
    }
    .meta {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: .9rem;
      color: #888;
      margin-top: .2rem;

      @include desktop() {
        font-size: .75rem;
      }
    }
  }

  &__intro {
    // background-image: linear-gradient(-180deg, $c-yellow 58%, $c-white 100%);
    // background-color: $c-yellow;
    background-image: linear-gradient(-220deg, #FCFFD6 0%, #E2FDFF 100%);
    height: 350px;
    max-width: 1200px;
    margin: 0 auto;
    color: #444;
    // overflow: hidden;
    position: relative;
    margin-top: -3rem;
    padding-top: 3rem;

    @include desktop() {
      height: 550px;
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
        right: 0rem;
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
      pointer-events: none;

      @media screen and (max-width: 1130px) {
        right: 0rem;
      }
      @media screen and (max-width: 700px) {
        width: 12rem;
        z-index: 1;
        top: 9.75rem;
        right: 1.5rem;
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

      @media screen and (max-width: 700px) {
        position: absolute;
        bottom: 2rem;
        left: 0;
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
