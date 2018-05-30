<template>
  <div class="home">
    <div class="home__intro">
      <div class="container">
        <div class="home__intro__illu">
          <img src="/static/img/paul.png" alt="Bikeapaul">
        </div>
        <div class="home__intro__content">
          <h1>Let's make our<br>cities <span>bikeable</span>!</h1>
          <p>{{ $t('home.lead') }}</p>
          <router-link v-if="!isLoggedIn" to="/register" class="home__intro__cta">{{ $t('home.registernow') }}</router-link>
          <router-link v-if="isLoggedIn" to="/add" class="home__intro__cta">{{ $t('home.addspot') }}</router-link>
        </div>
      </div>
    </div>

    <div class="home__spots" v-for="cat in spotCategories" v-bind:key="cat.id">
      <div class="container">
        <h2>{{ cat.title}}</h2>
        <region-switch></region-switch>
        <div class="home__spots__container">
          <div class="home__spots__item" v-for="spot in cat.spots" :key="spot._id">
            <c-entry-preview :entry="spot"></c-entry-preview>
          </div>
        </div>
        <router-link to="/entries" class="btn btn--centered">{{ $t('home.showall') }}</router-link>
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
              <router-link class="home__news__more" :to="'/news/' + article.id">{{ $t('home.more') }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="home__newsletter">
        <h2>Newsletter</h2>
        <p>{{ $t('home.newsletter') }}<br>{{ $t('home.nospam') }}</p>
        <!-- Begin MailChimp Signup Form -->
        <div id="mc_embed_signup" class="home__newsletter__form">
          <form action="https://bikeable.us15.list-manage.com/subscribe/post?u=5a9614abf208b7faae96233ff&amp;id=1df02df80c" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
            <div id="mc_embed_signup_scroll">
              <div class="mc-field-group">
                <label>
                  <span>{{ $t('home.emailadress') }}</span>
                  <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
                </label>
              </div>
              <div class="mc-field-group">
                <label>
                  <span>{{ $t('home.surname') }}</span>
                  <input type="text" value="" name="FNAME" class="" id="mce-FNAME">
                </label>
              </div>
              <div class="mc-field-group">
                <label>
                  <span>{{ $t('home.familyname') }}</span>
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
</template>

<script>

import Prismic from 'prismic.io';
import spots from '../api/spots';

import EntryPreview from '@/components/EntryPreview';
import RegionSwitch from '@/components/RegionSwitch';

export default {
  name: 'v-home',
  metaInfo: {
    title: 'Bikeable'
  },
  props: [],
  components: {
    'c-entry-preview': EntryPreview,
    'region-switch': RegionSwitch
  },
  computed: {
    entries() {
      return this.$store.getters.allSpots;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userCoords() {
      return this.$store.state.userCoords;
    },
    selectedRegion() {
      return this.$store.getters.selectedRegion;
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
    'selectedRegion' : function(to, from) {
      this.loadSpots();
    }
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
            sort: cat.sort,
            region: this.selectedRegion
          })
          .then((entries) => {
            this.$store.commit('LOAD_FINISH');
            cat.spots = entries;
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
    max-width: 600px;
    margin: 2rem auto;
    background: $c-grey;
    padding: 2rem;

    &__form {
      margin-top: 2rem;
    }

    @include tablet {
      border: 2px solid $c-blue;
      border-radius: 6px;
    }
  }

  &__news {
    margin: 3rem 0;

    @include tablet() {
      margin: 4rem 0;
    }

    &__container {
      margin-top: 2rem;

      @include tablet() {
        margin-top: 3rem;
      }
    }

    &__item {
      display: flex;
      margin-top: 1rem;

      @include tablet() {
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
      color: $c-grey-darkest;
    }

    &__content {
      padding-left: 1rem;
      padding-top: 0;

      h3 {
        line-height: 1;
        font-size: 1.5rem;
        margin-bottom: .75rem;
        font-family: $f-head;
        margin-top: .4rem;

        a {
          color: $c-main;
          text-decoration: none;
          hyphens: auto;

          &:hover {
            color: $c-black;
          }
        }
      }

      p {
        font-size: 1rem;
      }

      @include tablet() {
        padding-left: 1.5rem;
        padding-top: 0;
      }
    }

    &__image {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
      // box-shadow: 2px 2px 0 0 $c-grey-dark;

      @include tablet() {
        width: 250px;
        height: 250px;
      }
    }
  }

  &__spots {
    margin: 3rem 0;

    @include tablet() {
      margin: 4rem 0 5rem 0;
    }

    h2 {
      margin-bottom: .5rem;
    }

    &__container {
      margin-top: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
    }
    &__button {
      text-decoration: none;
      font-weight: 600;
    }
    &__item {
      width: 100%;
      
      @include tablet {
        width: calc(50% - 1rem);
      }
      // @include desktop {
      //   width: calc(33.3% - 1.33rem);
      // }
    }
  }

  &__add {
    max-width: 1200px;
    margin: 0 auto;
    background-image: linear-gradient(-220deg, #FCFFD6 0%, #E2FDFF 100%);

    @include tablet {
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
    background-image: linear-gradient(45deg, #F4FDB5 0%, #CAFBFF 100%);
    height: 400px;
    margin: 0 auto;
    color: #444;
    position: relative;
    margin-top: -3rem;
    margin-bottom: -5rem;
    padding-top: 3rem;
    overflow: hidden;

    &::before {
      content: "";
      display: block;
      position: absolute;
      bottom: -200px;
      left: 0;
      width: 100%;
      height: 200px;
      background: #fff;
      transform: skewY(-4deg);
      transform-origin: 0% 100%;
    }

    @include tablet() {
      height: 700px;
      margin-top: -4rem;
      margin-bottom: -6rem;
      padding-top: 0;
    }
    @include desktop() {
      height: 42rem;
    }

    .container {
      max-width: 25rem;

      @include tablet {
        max-width: 66.6rem;
      }
    }

    &__content {
      padding-top: 6rem;

      @include tablet() {
        padding-top: 14rem;
      }
    }
    &__illu {
      position: absolute;
      top: 5rem;
      right: -2rem;
      width: 8rem;
      transform-origin: 50% 93%;
      // animation: paul .4s linear 0s infinite normal forwards;
      pointer-events: none;

      img {
        width: 100%;
        height: auto;
      }

      @include tablet {
        width: 14rem;
        right: 1rem;
        top: 12rem;
      }
      @include desktop {
        width: 18rem;
        right: 3rem;
        top: 14rem;
      }
    }
    &__cta {
      display: inline-block;
      font-size: 1rem;
      text-decoration: none;
      font-weight: 400;
      background-color: rgba(#fff, .2);
      padding: 0 2rem;
      margin-left: 0;
      margin-top: 2rem;
      color: $c-black;
      border: 2px solid rgba($c-black, .2);
      opacity: 0;
      line-height: 2.5rem;
      border-radius: 1.25rem;
      transition: .1s border-color, .1s background-color;
      animation: headline 1s $easeOutQuint .9s 1 normal forwards;

      &:hover {
        border-color: $c-main;
        background-color: rgba(#fff, .5);
      }
    }
    h1 {
      color: $c-black;
      margin: 0;
      font-weight: 700;
      font-size: 1.75rem;
      line-height: 1;
      margin-bottom: 1rem;
      text-transform: none;
      text-align: left;
      text-decoration: none;
      opacity: 0;
      animation: headline 1s $easeOutQuint .3s 1 normal forwards;

      a {
        color: $c-main;
      }
      span {
        position: relative;

        &::after {
          content: "";
          display: block;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: $c-main;
        }
        // text-shadow: 2px 2px 2px rgba($c-main, .4);

        @include tablet {
          &::after {
            height: 5px;
            bottom: 5px;
          }
        }
      }

      @include tablet() {
        font-size: 3rem;
      }
      @include desktop() {
        font-size: 3.5rem;
      }
    }
    p {
      font-size: .8rem;
      line-height: 1.6;
      color: $c-black;
      padding-right: 5rem;
      width: 14rem;
      opacity: 0;
      animation: headline 1s $easeOutQuint .6s 1 normal forwards;

      a {
        color: #444;
      }

      @include tablet {
        padding-right: 15rem;
        font-size: 1rem;
        width: auto;
      }
      @include desktop {
        padding-right: 24rem;
      }
    }
  }
}

@keyframes paul {
  0% {
    transform: rotate(0) translateY(0) ;
  }
  25% {
    transform: rotate(.4deg) translateY(3px);
  }
  75% {
    transform: rotate(-.4deg) translateY(-3px);
  }
  100% {
    transform: rotate(0) translateY(0) ;
  }
}

@keyframes headline {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

</style>
