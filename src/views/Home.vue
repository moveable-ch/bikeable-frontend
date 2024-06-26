<template>
  <div class="home">
    <div class="home__intro">
      <div class="container">
        <div class="home__intro__illu">
          <img src="/img/paul.png" alt="Bikeapaul" />
        </div>
        <div class="home__intro__content">
          <a
            v-if="currentCountry == 'ch'"
            :href="$t('home.stickerlink')"
            target="_blank"
            class="home__stickerbtn"
            >{{ $t("home.order_stickers") }}</a
          >
          <h1>Let's make our<br />cities <span>bikeable</span>!</h1>
          <p>{{ $t("home.lead") }}</p>
          <router-link
            v-if="!isLoggedIn"
            to="/register"
            class="home__intro__cta"
            >{{ $t("home.registernow") }}</router-link
          >
          <router-link v-if="isLoggedIn" to="/add" class="home__intro__cta">{{
            $t("home.addspot")
          }}</router-link>
        </div>
      </div>
    </div>

    <div class="home__spots" v-for="cat in spotCategories" v-bind:key="cat.id">
      <div class="container" v-if="cat.loaded">
        <h2>{{ cat.title }}</h2>
        <region-switch></region-switch>
        <div class="home__spots__container">
          <div
            class="home__spots__item"
            v-for="spot in cat.spots"
            :key="spot._id"
          >
            <c-entry-preview v-if="spot.photo" :entry="spot"></c-entry-preview>
          </div>
        </div>
        <router-link to="/entries" class="btn btn--centered">{{
          $t("home.showall")
        }}</router-link>
      </div>
    </div>

    <div class="home__news">
      <div class="container">
        <h2>Bikeable News</h2>
        <div class="home__news__container">
          <div
            class="home__news__item"
            v-for="article in news"
            v-bind:key="article.id"
          >
            <router-link
              class="home__news__imagewrap"
              :to="'/news/' + article.id"
              ><img class="home__news__image" :src="article.image"
            /></router-link>
            <div class="home__news__content">
              <span class="home__news__date">{{ article.date }}</span>
              <h3>
                <router-link :to="'/news/' + article.id">{{
                  article.title
                }}</router-link>
              </h3>
              <p>{{ article.abstract }}</p>
              <router-link
                class="home__news__more"
                :to="'/news/' + article.id"
                >{{ $t("home.more") }}</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Prismic from "prismic.io";
import spots from "../api/spots";

import EntryPreview from "@/components/EntryPreview";
import RegionSwitch from "@/components/RegionSwitch";

export default {
  name: "v-home",
  metaInfo: {
    title: "Bikeable",
  },
  props: [],
  components: {
    "c-entry-preview": EntryPreview,
    "region-switch": RegionSwitch,
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
    },
    prismicLang() {
      return this.$store.getters.prismicLang;
    },
    currentLang() {
      return this.$store.getters.lang;
    },
    currentCountry() {
      return this.$store.getters.country;
    },
    mailchimpUrl() {
      if (this.currentLang == "fr") {
        return "https://bikeable.us15.list-manage.com/subscribe/post?u=5a9614abf208b7faae96233ff&amp;id=386b5b5367";
      } else {
        return "https://bikeable.us15.list-manage.com/subscribe/post?u=5a9614abf208b7faae96233ff&amp;id=1df02df80c";
      }
    },
  },
  data() {
    return {
      news: {},
      spotCategories: [
        {
          id: 0,
          title: "New Spots",
          spots: [{}, {}, {}, {}],
          sort: "date",
          limit: 8,
          loaded: false,
          meta(spot) {
            if (!spot.createdAt) return "";
            let d = new Date(spot.createdAt);
            return d.toLocaleDateString("de-DE");
          },
        },
        {
          id: 1,
          title: "Top Spots",
          spots: [{}, {}, {}, {}],
          sort: "votes",
          limit: 4,
          loaded: false,
          meta(spot) {
            return spot.votes + " Votes";
          },
        },
      ],
    };
  },
  watch: {
    selectedRegion: function(to, from) {
      this.loadSpots();
    },
    prismicLang(to, from) {
      this.loadNews();
    },
  },
  methods: {
    loadNews() {
      // TODO: Move to Store
      this.$store.commit("LOAD_START");

      this.fetchNews().then((data) => {
        this.news = data;
        this.$store.commit("LOAD_FINISH");
      });
    },

    loadSpots() {
      // TODO: Move to Store
      this.$store.commit("LOAD_START");

      this.spotCategories.forEach((cat) => {
        spots
          .getAllSpots({
            limit: cat.limit,
            sort: cat.sort,
            region: this.selectedRegion,
            country: this.currentCountry,
          })
          .then(
            (entries) => {
              this.$store.commit("LOAD_FINISH");
              cat.spots = entries;
              cat.loaded = true;
            },
            (error) => {
              this.$store.commit("LOAD_FINISH");
              this.$store.dispatch("handleError", "Fehler");
            }
          );
      });
    },

    fetchNews() {
      var documentType = "news";

      if (this.currentCountry == "de") {
        documentType += "_de";
      } else if (this.currentCountry == "at") {
        documentType += "_at";
      } else if (this.currentCountry == "us") {
        documentType += "_us";
      }
      return Prismic.api("https://bikeable.prismic.io/api")
        .then((api) => {
          return api.query(
            Prismic.Predicates.at("document.type", documentType),
            {
              orderings: "[document.first_publication_date desc]",
              lang: this.prismicLang,
            }
          );
        })
        .then(
          (payload) => {
            const y = [];
            y.questions = payload.results.slice(0, 3).map((x) => {
              const z = {};
              z.id = x.id;
              let date = new Date(x.firstPublicationDate);
              z.date = date.toLocaleDateString("de-DE");
              z.title = x.getText(documentType + ".news_title");
              z.abstract = x.getText(documentType + ".news_abstract");
              if (x.getImage(documentType + ".news_image")) {
                z.image = x.getImage(
                  documentType + ".news_image"
                ).views.preview.url;
              }
              y.push(z);
            });
            return y;
          },
          function(err) {
            console.log("Something went wrong: ", err);
          }
        );
    },

    formatDate(date) {
      if (!date) return "";
      let d = new Date(date);
      return d.toLocaleDateString("de-DE");
    },
  },
  mounted() {
    // this.$store.dispatch('getAllSpots');
    this.loadNews();
    this.loadSpots();
  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.home {
  &__stickerbtn {
    position: absolute;
    right: 0;
    bottom: -4rem;
    width: 8rem;
    height: 8rem;
    line-height: 1.2;
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 99%;
    background-color: $c-main;
    font-size: 0.9rem;
    color: #fff;
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.2);
    font-weight: 700;
    text-align: center;
    display: flex;
    align-items: center;
    border: 3px dotted #fff;
    filter: drop-shadow(0 4px 0.5rem rgba(0, 0, 0, 0.2));
    transform: rotate(-5deg);
    transition: 0.3s transform $easeOutBack;

    &:hover {
      color: #fff;
      transform: rotate(-9deg) scale(1.1);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    @include tablet {
      bottom: -4rem;
      right: 12rem;
    }
    @include desktop {
      bottom: -6rem;
      right: 17rem;
    }
  }
  &__newsletter {
    max-width: 600px;
    margin: 2rem auto;
    background: $c-grey;
    padding: 2rem 1rem;

    &__form {
      margin-top: 2rem;
    }

    @include tablet {
      border: 2px solid $c-blue;
      border-radius: 6px;
      padding: 2rem;
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

    &__imagewrap {
      display: none;
      box-shadow: 0 5px 15px -5px rgba($c-black, 0.2);
      border-radius: 4px;
      overflow: hidden;
      width: 250px;
      height: 250px;
      flex-shrink: 0;
      margin-right: 1rem;

      @include tablet() {
        display: block;
      }
    }
    &__image {
      display: block;
      width: 100%;
    }

    &__more {
      display: inline-block;
      font-size: 0.9rem;
      margin-top: 1rem;
    }

    &__date {
      font-size: 0.8rem;
      color: $c-grey-darkest;
    }

    &__content {
      padding-top: 0;

      h3 {
        line-height: 1;
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
        font-family: $f-head;
        margin-top: 0.4rem;

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
  }

  &__spots {
    margin: 3rem 0;

    @include tablet() {
      margin: 4rem 0 5rem 0;
    }

    .regionswitch {
      max-width: 25rem;

      label {
        display: none;
      }
    }

    h2 {
      margin-bottom: 0.5rem;
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
    background-image: linear-gradient(-220deg, #fcffd6 0%, #e2fdff 100%);

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
    background-image: linear-gradient(45deg, #f4fdb5 0%, #cafbff 100%);
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
      background-color: #fff;
      padding: 0 2rem;
      margin-left: 0;
      margin-top: 2rem;
      color: $c-black;
      border: 2px solid #fff;
      box-shadow: 0 10px 25px -5px rgba($c-black, 0.2);
      opacity: 0;
      line-height: 2.5rem;
      border-radius: 4px;
      transition: 0.3s border-color;
      animation: headline 1s $easeOutQuint 0.9s 1 normal forwards;

      &:hover {
        border-color: rgba($c-main, 0.5);
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
      animation: headline 1s $easeOutQuint 0.3s 1 normal forwards;

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
      font-size: 0.8rem;
      line-height: 1.6;
      color: $c-black;
      padding-right: 5rem;
      width: 14rem;
      opacity: 0;
      animation: headline 1s $easeOutQuint 0.6s 1 normal forwards;

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
    transform: rotate(0) translateY(0);
  }
  25% {
    transform: rotate(0.4deg) translateY(3px);
  }
  75% {
    transform: rotate(-0.4deg) translateY(-3px);
  }
  100% {
    transform: rotate(0) translateY(0);
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
