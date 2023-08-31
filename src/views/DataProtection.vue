<template>
  <div class="contentpage data-protection">
    <div class="container">
      <component :is="localizedDataProtection" />
    </div>
  </div>
</template>

<script>
import dataProtectionDe from "../components/DataProtection.de.vue";
import dataProtectionEn from "../components/DataProtection.en.vue";
import dataProtectionFr from "../components/DataProtection.fr.vue";
import dataProtectionIt from "../components/DataProtection.it.vue";

export default {
  components: {
    dataProtectionDe,
    dataProtectionEn,
    dataProtectionFr,
    dataProtectionIt,
  },
  computed: {
    localizedDataProtection() {
      switch (this.$store.getters.lang) {
        case "en":
          return dataProtectionEn;
        case "fr":
          return dataProtectionFr;
        case "de":
          return dataProtectionDe;
        case "it":
          return dataProtectionIt;
        default:
          return dataProtectionDe;
      }
    },
  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.data-protection {
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
