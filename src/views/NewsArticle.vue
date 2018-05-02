<!-- /news/{id} -->

<template>
  <div class="contentpage news">
    <div class="container" v-if="doc">
      <h1 class="news__headline">{{ doc.title }}</h1>
      <span class="date">{{ doc.date }}</span>
      <img class="news__image" :src="doc.image">
      <div v-html="doc.text"></div>
    </div>
  </div>
</template>

<script>

import Prismic from 'prismic.io';

export default {
  name: 'v-news-article',
  data () {
    return {
      newsId: 0,
      doc: null
    }
  },
  mounted() {
    this.newsId = this.$route.params.id;
    this.$store.commit('LOAD_START');

    this.getData().then(data => {
      this.$store.commit('LOAD_FINISH');
      this.doc = data;
    });
  },
  methods: {
    getData() {
      return Prismic.api("https://bikeable.prismic.io/api").then((api) => {
        return api.query(
          Prismic.Predicates.at('document.id', this.newsId),
          {}
        );
      }).then(function(payload) {
        const y = {};
        let date = new Date(payload.results[0].firstPublicationDate);
        y.date = date.toLocaleDateString('de-DE');
        y.title = payload.results[0].getText('news.news_title');
        y.text = payload.results[0].getStructuredText('news.news_text').asHtml();
        y.image = payload.results[0].getImage('news.news_image').url;
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

.news {

  p {
    margin: 1rem auto;
  }

  &__headline {
    font-size: 1.75rem;
    text-align: left;
    margin-top: 0;
    margin-bottom: .5rem;

    @include tablet() {
      text-align: center;
      font-size: 3.25rem;
      margin-top: 2rem;
    }
  }
  .date {
    display: block;
    text-align: left;
    font-size: 1.25rem;
    color: #aaa;

    @include tablet() {
      text-align: center;
    }
  }
  &__image {
    display: block;
    width: 100%;
    max-width: 750px !important;
    margin: 1rem auto;

    @include tablet() {
      margin: 2rem auto;
    }
  }
}


</style>
