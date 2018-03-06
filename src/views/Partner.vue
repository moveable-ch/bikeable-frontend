<!-- /partner -->

<template>
  <div class="contentpage partner">
    <div class="container">
      <h1>Partner</h1>
      <div class="partners" v-if="partners">
        <a target="_blank" v-for="partner in partners" :href="partner.website.url()" class="partner__item">
          <span class="partner__item__logo" :style="'background-image:url(' + partner.logo + ')'"></span>
        </a>
      </div>

      <ul class="sponsors" v-if="sponsors">
        <li v-for="sponsor in sponsors"><a target="_blank" :href="sponsor.website.url()">{{ sponsor.name }}</a></li>
      </ul>
    </div>
  </div>
</template>

<script>

import Prismic from 'prismic.io';

export default {
  name: 'v-partner',
  data () {
    return {
      partners: null,
      sponsors: null
    }
  },
  mounted() {
    this.$store.commit('LOAD_START');

    this.getPartners().then(partners => {
      this.partners = partners;
      this.$store.commit('LOAD_FINISH');
    });

    this.getSponsors().then(sponsors => {
      this.sponsors = sponsors;
    });
  },
  methods: {
    getPartners() {
      return Prismic.api("https://bikeable.prismic.io/api").then(function(api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'partner'),
          { lang: '*' }
        );
      }).then(function(payload) {
        return payload.results.map((x) => {
          const y = {};
          y.name = x.getText('partner.name');
          y.logo = x.getImage('partner.logo').url;
          y.website = x.getLink('partner.website');
          return y;
        });
      }, function(err) {
        console.log("Something went wrong: ", err);
      });
    },
    getSponsors() {
      return Prismic.api("https://bikeable.prismic.io/api").then(function(api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'sponsors'),
          { lang: '*' }
        );
      }).then(function(payload) {
        return payload.results.map((x) => {
          const y = {};
          y.name = x.getText('sponsors.name');
          y.website = x.getLink('sponsors.website');
          return y;
        });
      }, function(err) {
        console.log("Something went wrong: ", err);
      });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.partner {

  .partners {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin: 3rem 0;
  }
  &__item {
    display: block;
    width: 100%;
    margin-bottom: 2.6%;
    height: 10rem;
    background-color: #fff;
    box-sizing: border-box;
    border: 2px solid #eee;
    padding: 2rem;
    transition: .1s border-color;

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

    @include desktop() {
      width: 32%;
      margin-right: 2%;

      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }
  ul.sponsors {
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    font-family: $f-body;
    font-weight: 300;
    max-width: none;

    li {
      padding: 0 1rem;
      box-sizing: border-box;
      width: 100%;
      text-align: center;

      a {
        color: $c-main;
        font-size: 1.25rem;
        text-decoration: none;

        &:hover {
          color: $c-highlight;
        }
      }
      &::before {
        display: none;
      }

      @include desktop() {
        width: 33.3%;
      }
    }
  }
}


</style>
