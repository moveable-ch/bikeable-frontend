<template>
  <div class="contentpage about">
    <div class="container" v-if="doc">
      <div v-html="doc.text"></div>
    </div>
  </div>
</template>

<script>

import Prismic from 'prismic.io';

export default {
  name: 'v-about',
  data () {
    return {
      doc: null
    }
  },
  mounted() {
    this.$store.commit('LOAD_START');

    this.getData().then(data => {
      this.$store.commit('LOAD_FINISH');
      this.doc = data;
    });
  },
  methods: {
    getData() {
      return Prismic.api("https://bikeable.prismic.io/api").then(function(api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'about'),
          {}
        );
      }).then(function(payload) {
        const y = {};
        y.title = payload.results[0].getText('about.title');
        y.text = payload.results[0].getStructuredText('about.text').asHtml();
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

.about {

}


</style>
