<template>
  <div class="contentpage terms-conditions">
    <div class="container">
      <component :is="localizedTermsConditions" />
    </div>
  </div>
</template>

<script>
import termsConditionsDe from "../components/TermsConditions.de.vue";
import termsConditionsEn from "../components/TermsConditions.en.vue";
import termsConditionsFr from "../components/TermsConditions.fr.vue";
import termsConditionsIt from "../components/TermsConditions.it.vue";

export default {
  components: {
    termsConditionsDe,
  },
  computed: {
    localizedTermsConditions() {
      switch (this.$store.getters.lang) {
        case "en":
          return termsConditionsEn;
        case "fr":
          return termsConditionsFr;
        case "de":
          return termsConditionsDe;
        case "it":
          return termsConditionsIt;
        default:
          return termsConditionsDe;
      }
    },
  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.terms-conditions {

  b {
    font-weight: bold;
  }

  h2 {
    margin: 2rem auto;
    max-width: 45rem;
  }

  h3 {
    margin: 2rem auto;
    max-width: 45rem;
  }

  ul {
    max-width: 43rem;
  }
}
</style>
