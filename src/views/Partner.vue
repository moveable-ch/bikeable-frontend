<!-- /partner -->

<template>
  <div class="contentpage partner">
    <div class="container">
      <h1>{{ $t("partner.partner") }}</h1>
      <div class="partners" v-if="partners">
        <template v-for="(partner, index) in partners">
          <a
            :key="index"
            target="_blank"
            v-if="partner.website"
            :href="partner.website.url()"
            class="partner__item"
          >
            <span
              class="partner__item__logo"
              :style="'background-image:url(' + partner.logo + ')'"
            ></span>
          </a>
        </template>
      </div>

      <ul class="sponsors" v-if="sponsors">
        <li v-for="(sponsor, index) in sponsors" :key="index">
          <a target="_blank" :href="sponsor.website.url()">{{
            sponsor.name
          }}</a>
        </li>
      </ul>

      <div v-if="currentCountry==='ch'" class="provelo-map">
        <h3>{{ $t("partner.proveloregions") }}:</h3>
        <iframe
          src="https://html.bikeable.ch/provelo-map.html"
          frameborder="0"
        ></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import Prismic from "prismic.io";

export default {
  name: "v-partner",
  data() {
    return {
      partners: null,
      sponsors: null,
    };
  },
  mounted() {
    // TODO: Move to Store
    this.$store.commit("LOAD_START");   

    this.getPartners().then((partners) => {
      this.partners = partners;
      this.$store.commit("LOAD_FINISH");
    });

    this.getSponsors().then((sponsors) => {
      this.sponsors = sponsors;
    });
  },
  computed: {
    currentCountry() {
      return this.$store.getters.country;
    },
    prismicLang() {
      return this.$store.getters.prismicLang;
    },
    partnerAndSponsorLang() {
      if(this.$store.getters.country == "us") {
        return 'en-us';
      }
      return 'de-ch';
    },
  },  
  methods: {    
    getPartners() {
      return Prismic.api("https://bikeable.prismic.io/api")
        .then((api) => {
          return api.query(Prismic.Predicates.at("document.type", "partner"), {
            lang: this.partnerAndSponsorLang,
          });
        })
        .then(
          function (payload) {
            return payload.results.map((x) => {
              const y = {};
              y.name = x.getText("partner.name");
              y.logo = x.getImage("partner.logo")
                ? x.getImage("partner.logo").url
                : null;
              y.website = x.getLink("partner.website");
              return y;
            });
          },
          function (err) {
            console.log("Something went wrong: ", err);
          }
        );
    },
    getSponsors() {
      return Prismic.api("https://bikeable.prismic.io/api")
        .then((api) => {
          return api.query(Prismic.Predicates.at("document.type", "sponsors"), {
            lang: this.partnerAndSponsorLang,
          });
        })
        .then(
          function (payload) {
            return payload.results.map((x) => {
              const y = {};
              y.name = x.getText("sponsors.name");
              y.website = x.getLink("sponsors.website");
              return y;
            });
          },
          function (err) {
            console.log("Something went wrong: ", err);
          }
        );
    },
  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.partner {
  .partners {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1rem;
    margin: 3rem 0;
  }
  &__item {
    grid-column: span 6;
    display: block;
    width: 100%;
    aspect-ratio: 3/2;
    height: auto;
    background-color: rgba(#fff, 0.8);
    box-sizing: border-box;
    border: 2px solid #eee;
    padding: 1.5rem;
    border-radius: 4px;

    &__logo {
      display: block;
      width: 100%;
      height: 100%;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }

    &:hover {
      border-color: $c-main;
    }

    @include tablet() {
      grid-column: span 4;
    }
    @include desktop() {
      grid-column: span 3;
    }
  }
  ul.sponsors {
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(12, 1fr);
    flex-wrap: wrap;
    font-family: $f-body;
    font-weight: 300;
    max-width: none;
    align-items: flex-start;

    li {
      display: flex;
      // justify-content: center;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      grid-column: span 6;

      a {
        display: inline-block;
        color: $c-main;
        font-size: 1rem;
        background-color: #fff;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: 2px solid #eee;
        text-decoration: none;

        &:hover {
          border-color: $c-main;
        }
      }
      &::before {
        display: none;
      }

      @include tablet() {
        grid-column: span 4;
      }
      @include desktop() {
        grid-column: span 3;
      }
    }
  }

  .provelo-map {
    margin-top: 4rem;
    margin-bottom: 2rem;
    width: 100%;
    height: 20rem;

    @include tablet() {
      height: 30rem;
    }

    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
