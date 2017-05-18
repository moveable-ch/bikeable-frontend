<template>
  <div class="contentpage partner">
    <div class="container">
      <h1>Partner</h1>
      <p>Herzlichen Dank an alle good peoples die uns unterstüzzen. dope!</p>

      <div class="partners">
        <a v-for="partner in partners" :href="partner.url" class="partner__item">
          <span class="partner__item__logo" :style="'background-image:url('+partner.image+')'"></span>
        </a>
      </div>

      <ul class="sponsors">
        <li v-for="sponsor in sponsors"><a target="_blank" :href="sponsor.url">{{ sponsor.name }}</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'partner-view',
  data () {
    return {
      partners:
      [
        {
          name: 'ProVelo',
          url: 'http://www.provelo.ch',
          image: '/static/img/provelo.gif'
        },
        {
          name: 'Velo Plus',
          url: 'http://www.veloplus.ch',
          image: '/static/img/veloplus.gif'
        }
      ],
      sponsors: [
        {
          name: 'Rad-Los',
          url: '#'
        },
        {
          name: 'Veloloft',
          url: '#'
        },
        {
          name: 'Dreipol',
          url: '#'
        }
      ]
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
    border: 2px solid #fff;
    padding: 2rem;
    transition: .4s border-color;

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

    li {
      padding: 0;
      width: 33.3%;
      text-align: center;

      a {
        color: $c-main;
        font-size: 1.25rem;

        &:hover {
          color: $c-highlight;
        }
      }
      &::before {
        display: none;
      }
    }
  }
}


</style>
