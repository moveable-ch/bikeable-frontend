<!-- /news -->

<template>
  <div class="contentpage newsarchive">
    <div class="container" v-if="news">
      <h1>News</h1>
      <div class="newsarchive__container">
        <div class="newsarchive__item" v-for="article in news">
          <router-link class="newsarchive__imagebox" :to="'/news/' + article.id"><img class="newsarchive__image" :src="article.image"></router-link>
          <div class="newsarchive__content">
            <h3><router-link :to="'/news/' + article.id">{{ article.title }}</router-link></h3>
            <span class="date">{{ article.date }}</span>
            <p>{{ article.abstract }}</p>
            <router-link class="newsarchive__more" :to="'/news/' + article.id">{{ $t('home.more') }}</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Prismic from 'prismic.io';

export default {
  name: 'v-news',
  data () {
    return {
      news: null
    }
  },
  mounted() {
    this.$store.commit('LOAD_START');

    this.getData().then(data => {
      this.$store.commit('LOAD_FINISH');
      this.news = data;
    });
  },
  computed: {
    prismicLang() {
      return this.$store.getters.prismicLang;
    }
  },
  watch: {
    'prismicLang' (to, from) {
      this.$store.commit('LOAD_START');

      this.getData().then(data => {
        this.$store.commit('LOAD_FINISH');
        this.news = data;
      });
    }
  },
  methods: {
    getData() {
      return Prismic.api("https://bikeable.prismic.io/api").then((api) => {
        return api.query(
          Prismic.Predicates.at('document.type', 'news'),
          {
            orderings: '[document.first_publication_date desc]',
            lang: this.prismicLang
          }
        );
      }).then(function(payload) {
        const y = [];
        y.questions = payload.results.map((x) => {
          const z = {};
          z.id = x.id;
          let date = new Date(x.firstPublicationDate);
          z.date = date.getDate() + '.' + (date.getMonth()+1) + '.' + date.getFullYear();
          z.title = x.getText('news.news_title');
          z.abstract = x.getText('news.news_abstract');
          z.image = x.getImage('news.news_image').views.preview.url;
          y.push(z);
        });
        return y;
      }, function(err) {
        console.log("Something went wrong: ", err);
      });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.newsarchive {

  &__container {
    margin-top: 2rem;
  }

  &__item {
    display: flex;
    margin: 2rem 0;

    @include tablet() {
      max-width: 850px;
    }
  }

  &__more {
    display: inline-block;
    font-size: .9rem;
    margin-top: .5rem;
  }

  &__content {
    padding-left: 1rem;
    padding-top: 0;

    h3 {
      line-height: 1.1;
      font-size: 1.25rem;
      margin-bottom: 0;

      a {
        text-decoration: none;
      }
    }

    p {
      margin-top: .5rem;
      font-size: .9rem;
    }

    .date {
      font-size: .9rem;
      color: #aaa;
    }

    @include tablet() {
      padding-left: 1.5rem;
      padding-top: .5rem;
    }
  }

  &__imagebox {
    display: block;
    border-radius: 4px;
    overflow: hidden;
    width: 80px;
    height: 80px;
    box-shadow: 0 5px 15px -5px rgba($c-black, .2);

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
  }
}


</style>
