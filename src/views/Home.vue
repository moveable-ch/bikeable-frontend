<!-- / -->

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

    <div v-if="isLoggedIn" class="home__add">
      <div class="home__add__inner">
        <router-link to="/add" class="home__add__cta">Spot hinzufügen</router-link>
      </div>
    </div>

    <div class="home__spots" v-for="cat in spotCategories" v-bind:key="cat.id">
      <div class="container">
        <h2>{{ cat.title}}</h2>
        <div class="home__spots__container">
          <router-link :to="'/entries/' + spot._id" class="home__spots__item" v-for="spot in cat.spots" :key="spot._id" v-bind:class="{ famed: spot.famed }">
            <span v-if="spot.photo" class="home__spots__image" :style="'background-image: url(' + spot.photo.medium.url + ')'"></span>
            <span v-if="spot.title" class="home__spots__content">
              <span class="meta">{{ cat.meta(spot) }}</span>
              <h3>{{ spot.title }}</h3>
              <span class="address">{{ spot.address }}</span>
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
          <div class="home__news__item" v-for="article in news" v-bind:key="article.id">
            <router-link class="home__news__imagewrap" :to="'/news/' + article.id"><img class="home__news__image" :src="article.image"></router-link>
            <div class="home__news__content">
              <span class="home__news__date">{{ article.date }}</span>
              <h3><router-link :to="'/news/' + article.id">{{ article.title }}</router-link></h3>
              <p>{{ article.abstract }}</p>
              <router-link class="home__news__more" :to="'/news/' + article.id">Mehr</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="home__newsletter">
      <div class="container">
        <h2>Newsletter</h2>
        <p>Melde dich hier für unseren Newsletter an und erfahre regelmässig, was bei bikeable läuft.<br>Kein Spam imfall!</p>
        <!-- Begin MailChimp Signup Form -->
        <div id="mc_embed_signup">
          <form action="//bikeable.us15.list-manage.com/subscribe/post?u=5a9614abf208b7faae96233ff&amp;id=6d62b30edc" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
            <div id="mc_embed_signup_scroll">
              <div class="mc-field-group">
                <label>
                  <span>Email Adresse</span>
                  <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
                </label>
              </div>
              <div class="mc-field-group">
                <label>
                  <span>Vorname</span>
                  <input type="text" value="" name="FNAME" class="" id="mce-FNAME">
                </label>
              </div>
              <div class="mc-field-group">
                <label>
                  <span>Nachname</span>
                  <input type="text" value="" name="LNAME" class="" id="mce-LNAME">
                </label>
              </div>
              <div id="mce-responses" class="clear">
                <div class="response" id="mce-error-response" style="display:none"></div>
                <div class="response" id="mce-success-response" style="display:none"></div>
              </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
              <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_5a9614abf208b7faae96233ff_6d62b30edc" tabindex="-1" value=""></div>
              <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="btn"></div>
            </div>
          </form>
        </div>

        <!--End mc_embed_signup-->
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
      spotCategories: [
        {
          id: 0,
          title: 'New Spots',
          spots: [{},{},{},{}],
          sort: 'date',
          meta(spot) {
            if(!spot.createdAt) return '';
            let d = new Date(spot.createdAt);
            return d.toLocaleDateString('de-DE');
          }
        },
        {
          id: 1,
          title: 'Top Spots',
          spots: [{},{},{},{}],
          sort: 'votes',
          meta(spot) {
            return spot.votes + ' Votes';
          }
        }
      ]
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

      this.spotCategories.forEach((cat) => {
        spots.getAllSpots({
            limit: 4,
            sort: cat.sort
          })
          .then((entries) => {
            this.$store.commit('LOAD_FINISH');
            cat.spots = entries;
            console.log(entries);
          },
          (error) => {
            this.$store.commit('LOAD_FINISH');
            this.$store.dispatch('handleError', 'Fehler');
          });
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
          let date = new Date(x.firstPublicationDate);
          z.date = date.toLocaleDateString('de-DE');
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
    // this.$store.dispatch('getAllSpots');
    this.loadNews();
    this.loadSpots();
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.home {

  &__newsletter {

    p {
      margin-bottom: 2rem;
    }
  }

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

    &__date {
      font-size: .8rem;
      background-color: $c-grey-dark;
      color: #888;
      padding: 4px 8px;
    }

    &__content {
      padding-left: 1rem;
      padding-top: 0;

      h3 {
        line-height: 1;
        font-size: 1.75rem;
        margin-bottom: .75rem;
        text-transform: uppercase;
        font-family: $f-head;
        margin-top: .4rem;

        a {
          color: $c-main;
          text-decoration: none;

          &:hover {
            color: $c-black;
          }
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
      // box-shadow: 2px 2px 0 0 $c-grey-dark;

      @include desktop() {
        width: 250px;
        height: 250px;
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
      }
    }
    &__item {
      background-color: #f0f0f0;
      display: block;
      text-decoration: none;
      width: 100%;
      height: 12rem;
      margin-bottom: 1rem;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      // border-radius: 4px;
      overflow: hidden;

      @include desktop() {
        width: calc(50% - .5rem);
        height: 15rem;
        margin-left: 0;
        margin-right: 0;
      }

      &:hover {
        .home__spots__image::after {
          opacity: .6;
          transform: rotate(160deg);
          transition: .5s transform $easeOutBack, .5s opacity;
        }
        .home__spots__image::before {
          opacity: 1;
        }
      }
      &.famed {
        &:hover {
          .home__spots__image::after {
            opacity: .6;
            transform: rotate(-15deg);
          }
        }
        .meta {
          background-color: $c-main;
        }
      }
    }
    &__content {
      display: block;
      width: calc(100% - 2rem);
      z-index: 1;
      color: #fff;
      position: absolute;
      bottom: 1rem;
      left: 1rem;

      @include desktop {
      }

    }
    &__image {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-size: cover;
      background-position: center;
      position: relative;

      @include desktop() {
      }

      &::after {
        content: "";
        display: none;
        width: 150px;
        height: 150px;
        background-size: 100%;
        position: absolute;
        top: 2rem;
        right: 2rem;
        background-image: url('../assets/thumbs-up-white.svg');
        background-repeat: no-repeat;
        opacity: 0;
        transform: rotate(180deg);
        transition: .5s transform ease-in, .5s opacity;

        @include desktop() {
          display: block;
        }
      }
      &::before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        transition: .5s opacity;
        opacity: .6;
        background-image: linear-gradient(-160deg, rgba($c-highlight, .7) 0%, rgba(40,52,61,.9) 100%);
      }

      .famed & {
        &::after {
          transform: rotate(5deg);
        }
        &::before {
          background-image: linear-gradient(-160deg, rgba($c-main, .7) 0%, rgba(40,52,61,.9) 100%);
        }
      }
    }
    h3 {
      font-family: $f-head;
      text-transform: uppercase;
      font-size: 1.75rem;
      color: inherit;
      line-height: 1;
      margin-bottom: .2rem;
      hyphens: auto;
      text-shadow: 2px 2px 0 rgba($c-black, .3);
    }
    .address {
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: .9rem;
      color: inherit;
      line-height: 1.1;

      @include desktop() {
        font-size: .75rem;
      }
    }
    .meta {
      display: inline-block;
      background-color: $c-highlight;
      padding: 4px 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: .9rem;
      color: inherit;
      margin-bottom: .2rem;

      @include desktop() {
        font-size: .75rem;
      }
    }
  }

  &__add {
    max-width: 1200px;
    margin: 0 auto;
    background-image: linear-gradient(-220deg, #FCFFD6 0%, #E2FDFF 100%);

    @include desktop {
      margin: 1rem auto;
    }

    &__inner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 6rem;
    }
    &__cta {
      display: inline-block;
      font-size: 1rem;
      background-color: $c-main;
      padding: 1rem 2rem;
      border-radius: 4px;
      color: $c-grey;
      box-shadow: 0 2px 0 0 lighten($c-main, 30%);
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
        right: 0;
        width: 36rem;
        height: 24rem;
      }
    }
    &__illu {
      position: absolute;
      top: 5.3rem;
      right: 13.8rem;
      width: 17rem;
      transform-origin: 50% 93%;
      animation: paul .7s ease-out 0s infinite normal forwards;
      // transform: rotate(-10deg);
      pointer-events: none;

      @media screen and (max-width: 1130px) {
        right: .7rem;
      }
      @media screen and (max-width: 700px) {
        width: 10rem;
        z-index: 1;
        top: 10rem;
        right: 2.8rem;
      }

      img {
        width: 100%;
        height: auto;
      }
    }
    &__cta {
      display: inline-block;
      font-family: $f-head;
      font-size: 1.25rem;
      text-decoration: none;
      font-weight: 700;
      margin-left: 2rem;
      letter-spacing: .03rem;
      text-transform: uppercase;
      transform: skew(0, -4deg);
      color: $c-highlight;
      // border-bottom: 2px solid $c-highlight;
      opacity: 0;
      animation: headline 1s ease-out .6s 1 normal forwards;

      &::before {
        content: "→";
        margin-right: .5rem;
        text-decoration: none;
      }

      @media screen and (max-width: 700px) {
        position: absolute;
        bottom: 2rem;
        left: 0;
      }

      &:hover {
        border-color: $c-black;
      }
    }
    h1 {
      color: $c-main;
      margin: 0;
      font-weight: bold;
      font-size: 2.75rem;
      line-height: .9;
      margin-bottom: .25rem;
      transform-origin: 0% 0%;
      transform: skew(0, -4deg);
      text-shadow:
          1px 1px 0 darken($c-main, 12%),
           2px 2px 0 darken($c-main, 12%),
           3px 3px 0 darken($c-main, 12%),
           4px 4px 0 darken($c-main, 12%),
           5px 5px 0 darken($c-main, 12%);
      // text-shadow: 4px 4px 0 $c-highlight;
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
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(.5deg);
  }
  75% {
    transform: rotate(-.5deg);
  }
  100% {
    transform: rotate(0deg);
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
    transform: translateY(30px) skew(0, -4deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0) skew(0, -4deg);
    opacity: 1;
  }
}

</style>
