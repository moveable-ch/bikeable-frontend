<!-- /about -->

<template>
  <div class="contentpage about">
    <div class="container" v-if="doc">
      <h1>{{ doc.title }}</h1>
      <p class="lead" v-html="doc.lead"></p>
      <div v-html="doc.text"></div>

      <AboutTeam :teamData="doc.team" />

      <div v-html="doc.aboutText"></div>

      <div class="about__paypal">
        <h3>{{ $t('about.paypal') }}</h3>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick">
        <input type="hidden" name="hosted_button_id" value="QLV8ZWA3FCS3S">
        <input type="image" src="https://www.paypalobjects.com/de_DE/CH/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="Jetzt einfach, schnell und sicher online bezahlen – mit PayPal.">
        <img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1">
        </form>
        <!--<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
        <input type="hidden" name="cmd" value="_s-xclick">
        <input type="hidden" name="hosted_button_id" value="HQFBMY4GKF2PW">
        <table>
        <tr><td><input type="hidden" name="on0" value="Werbeabo auf bikeable.ch">Werbeabo auf bikeable.ch</td></tr><tr><td><input type="text" name="os0" maxlength="200"></td></tr>
        </table>
        <input type="image" src="https://www.paypalobjects.com/de_DE/CH/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="Jetzt einfach, schnell und sicher online bezahlen – mit PayPal.">
        <img alt="" border="0" src="https://www.paypalobjects.com/de_DE/i/scr/pixel.gif" width="1" height="1">
        </form>-->

      </div>
    </div>
  </div>
</template>

<script>

import Prismic from 'prismic.io';
import AboutTeam from '../components/AboutTeam';

export default {
  name: 'v-about',
  data () {
    return {
      doc: null
    }
  },
  components: {
    AboutTeam
  },
  watch: {
    'prismicLang' (to, from) {
      this.$store.commit('LOAD_START');

      this.getData().then(data => {
        this.$store.commit('LOAD_FINISH');
        this.doc = data;
      });
    }
  },
  mounted() {

    // TODO: Move to Store
    this.$store.commit('LOAD_START');

    this.getData().then(data => {
      this.$store.commit('LOAD_FINISH');
      this.doc = data;
    });
  },
  computed: {
    prismicLang() {
      return this.$store.getters.prismicLang;
    }
  },
  methods: {
    // TODO: Move to Store
    getData() {
      return Prismic.api("https://bikeable.prismic.io/api").then((api) => {
        return api.query(
          Prismic.Predicates.at('document.type', 'about'),
          { lang: this.prismicLang }
        );
      }).then((payload) => {
        if(!payload.results[0]) return {};
        const y = {};
        y.title = payload.results[0].getText('about.title');
        y.lead = payload.results[0].getText('about.lead');
        y.text = payload.results[0].getStructuredText('about.text').asHtml();
        y.aboutText = payload.results[0].getStructuredText('about.about_text').asHtml();
        y.team = payload.results[0].getGroup('about.team');
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

  &__paypal {
    text-align: center;

    h3 {
      margin: 1rem auto;
    }
  }
}


</style>
