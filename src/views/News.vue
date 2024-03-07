<!-- /news -->

<template>
  <div>
    <div class="contentpage newsarchive">
      <div class="container" v-if="news">
        <h1>News</h1>
        <div class="newsarchive__container">
          <div
            class="newsarchive__item"
            v-for="article in news"
            :key="article.id"
          >
            <router-link
              class="newsarchive__imagebox"
              :to="'/news/' + article.id"
              ><img class="newsarchive__image" :src="article.image"
            /></router-link>
            <div class="newsarchive__content">
              <span class="date">{{ article.date }}</span>
              <h3>
                <router-link :to="'/news/' + article.id">{{
                  article.title
                }}</router-link>
              </h3>
              <p>{{ article.abstract }}</p>
              <router-link
                class="newsarchive__more"
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

export default {
  name: "v-news",
  data() {
    return {
      news: null,
    };
  },
  mounted() {
    // TODO: Move to Store
    this.$store.commit("LOAD_START");

    this.getData().then((data) => {
      this.$store.commit("LOAD_FINISH");
      this.news = data;
    });
  },
  computed: {
    prismicLang() {
      return this.$store.getters.prismicLang;
    },
    currentCountry() {
      return this.$store.getters.country;
    },
  },
  watch: {
    prismicLang(to, from) {
      // TODO: Move to Store
      this.$store.commit("LOAD_START");

      this.getData().then((data) => {
        this.$store.commit("LOAD_FINISH");
        this.news = data;
      });
    },
  },
  methods: {
    getData() {
      var documentType = "news";

      if(this.currentCountry == "de") {
        documentType += "_de";
      } else if(this.currentCountry == "at") {
        documentType += "_at";
      } else if(this.currentCountry == "us") {
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
          function(payload) {
            const y = [];
            y.questions = payload.results.map((x) => {
              const z = {};
              z.id = x.id;
              let date = new Date(x.firstPublicationDate);
              z.date =
                date.getDate() +
                "." +
                (date.getMonth() + 1) +
                "." +
                date.getFullYear();
              z.title = x.getText(documentType + ".news_title");
              z.abstract = x.getText(documentType + ".news_abstract");
              if(x.getImage(
                documentType + ".news_image"
              )) {
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
  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.newsarchive {
  &__container {
    margin-top: 2rem;
  }

  &__item {
    display: flex;
    margin: 2rem 0;

    @include tablet() {
      max-width: 850px;
      margin: 3rem 0;
    }
  }

  &__more {
    display: inline-block;
    font-size: 0.9rem;
    margin-top: 0.75rem;
  }

  &__content {
    padding-left: 1rem;
    padding-top: 0;

    h3 {
      line-height: 1.1;
      font-size: 1.3rem;
      margin-bottom: 0;
      margin: 0.5rem 0;

      a {
        text-decoration: none;
      }
    }

    p {
      margin-top: 0.5rem;
      margin-bottom: 0;
      font-size: 0.9rem;
    }

    .date {
      font-size: 0.8rem;
      opacity: 0.5;
    }

    @include tablet() {
      padding-left: 1.5rem;
      padding-top: 0;
    }
  }

  &__imagebox {
    display: block;
    border-radius: 8px;
    overflow: hidden;
    width: 4rem;
    height: 4rem;
    flex-shrink: 0;
    background-color: #fff;
    box-shadow: 0 5px 15px -5px rgba($c-black, 0.2);

    @include tablet() {
      width: 200px;
      height: 200px;
    }
  }
  &__image {
    display: block;
    width: 100%;
    height: 100% !important;
    flex-shrink: 0;
    object-fit: cover;
  }
}
</style>
