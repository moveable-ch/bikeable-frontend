<!-- /faq -->

<template>
  <div class="contentpage faq">
    <div class="container" v-if="doc">
      <h1>{{ doc.title }}</h1>
      <div class="faq__item" v-for="question in doc.questions" v-bind:key="question.id">
        <h3>{{ question.title }}</h3>
        <div v-html="question.text"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Prismic from 'prismic.io';

export default {
  name: 'v-faq',
  data () {
    return {
      doc: null
    }
  },
  mounted() {
    // TODO: Move to Store
    this.$store.commit('LOAD_START');

    this.getData().then(data => {
      this.doc = data;
      this.$store.commit('LOAD_FINISH');
    });
  },
  computed: {
    prismicLang() {
      return this.$store.getters.prismicLang;
    },
    currentCountry() {
      return this.$store.getters.country;
    }
  },
  methods: {
    getData() {
      return Prismic.api("https://bikeable.prismic.io/api").then((api) => {
        return api.query(
          Prismic.Predicates.at('document.type', 'faq'),
          { lang: this.prismicLang }
        );
      }).then((payload) => {
        if(!payload.results[0]) {
          const y = {};
          y.title = "—";
          y.questions = [
            {
              title: '',
              text: ''
            }
          ]
          return y;
        }
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
    margin: 0 auto;
    // max-width: 650px;
    margin-bottom: 1rem;
    color: $c-black;
    font-size: 1.25rem;
    text-decoration: underline;
    text-decoration-color: $c-main;
    text-underline-offset: 2px;
    font-family: $f-head;
  }
  p {
    margin-top: 0;
  }

  &__item {
    margin: 2rem 0;

    @include tablet() {
      margin: 3rem 0;
    }
  }
}

</style>
