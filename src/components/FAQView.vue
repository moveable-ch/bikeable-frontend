<template>
  <div class="contentpage faq">
    <div class="container" v-if="doc">
      <h1>{{ doc.title }}</h1>
      <div class="faq__item" v-for="question in doc.questions">
        <h3>{{ question.title }}</h3>
        <div v-html="question.text"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Prismic from 'prismic.io';

export default {
  name: 'about-view',
  data () {
    return {
      doc: null
    }
  },
  mounted() {
    this.$store.commit('LOAD_START');

    this.getData().then(data => {
      this.doc = data;
      this.$store.commit('LOAD_FINISH');
    });
  },
  methods: {
    getData() {
      return Prismic.api("https://bikeable.prismic.io/api").then(function(api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'faq'),
          {}
        );
      }).then(function(payload) {
        const y = {};
        y.title = payload.results[0].getText('faq.title');
        y.questions = payload.results[0].getGroup('faq.questions').toArray().map((x) => {
          const y = {};
          y.title = x.getText('question');
          y.text = '';
          if(x.getStructuredText('answer')) {
            y.text = x.getStructuredText('answer').asHtml();
          }
          return y;
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


.faq {
  h3 {
    font-family: $f-body;
    text-transform: none;
    font-weight: 500;
    font-size: 1.25rem;
    color: $c-main;
    padding: .3rem 0;
    margin-bottom: .5rem;
  }
  p {
    padding-left: 0;

    @include desktop() {
      padding-left: 1rem;
    }
  }

  &__item {
    margin: 2rem 0;

    @include desktop() {
      margin: 2rem 0;
    }
  }
}

</style>
