<template>
  <div class="entry-media" v-bind:class="{ 'is-expanded': isExpanded }">
    <div class="main-carousel">
      <div class="carousel-cell entry-media__titlecard">
        <div v-if="entry.votes" class="entry-media__votes" v-bind:class="{ 'is-active': hasVoted, disabled: !isLoggedIn, 'famed': entry.famed }">
          <a  @click.prevent="$emit('vote')" class="entry-media__votes__button" href="#" title="Upvote">
            <svg width="38px" height="38px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Artboard-Copy-4" transform="translate(-55.000000, -184.000000)" fill="#FE0094" fill-rule="nonzero">
                  <path d="M88.0791191,210.889976 C88.8162973,209.929072 89.169842,208.898983 89.1247086,207.838146 C89.0795753,206.669687 88.5680639,205.754906 88.1468192,205.193739 C88.6357639,203.948408 88.8238196,201.988164 87.1914964,200.466093 C85.9954623,199.351444 83.9644611,198.851774 81.1511483,198.990144 C79.1728026,199.082391 77.5179128,199.459065 77.4502127,199.47444 C77.0665792,199.543625 76.6679011,199.628185 76.2617009,199.720431 C76.231612,199.228449 76.3143565,198.006179 77.2019792,195.254151 C78.255091,191.979391 78.1949132,189.473354 77.0064013,187.797538 C75.7577117,186.037163 73.7643216,185.898793 73.1775879,185.898793 C72.6134209,185.898793 72.0943873,186.137097 71.7257982,186.575269 C70.890831,187.566921 70.9886199,189.396482 71.0939311,190.242077 C70.1009972,192.963356 67.3177733,199.635872 64.9633163,201.488494 C64.9181829,201.519243 64.8805718,201.557679 64.8429607,201.596115 C64.1509158,202.341777 63.6845378,203.148936 63.3686042,203.856161 C62.9247929,203.610169 62.4208037,203.471799 61.8792033,203.471799 L57.290645,203.471799 C55.5605329,203.471799 54.1613987,204.909311 54.1613987,206.669687 L54.1613987,219.161435 C54.1613987,220.929498 55.5680551,222.359322 57.290645,222.359322 L61.8792033,222.359322 C62.5486815,222.359322 63.1730263,222.14408 63.6845378,221.775093 L65.452261,221.990335 C65.7230612,222.028771 70.5372863,222.651437 75.4793893,222.551503 C76.3745343,222.620688 77.2170237,222.659124 77.9993353,222.659124 C79.3458139,222.659124 80.5192812,222.551503 81.4971707,222.336261 C83.7989721,221.836591 85.3711175,220.837251 86.1684735,219.36899 C86.7777739,218.246654 86.7777739,217.132006 86.6799849,216.424781 C88.1769081,215.04108 88.440186,213.511321 88.3875304,212.435109 C88.3574415,211.812443 88.2220414,211.282024 88.0791191,210.889976 Z M56.1923999,219.161435 L56.1923999,206.662 C56.1923999,206.039334 56.6888669,205.539664 57.290645,205.539664 L61.8792033,205.539664 C62.4885037,205.539664 62.9774484,206.047021 62.9774484,206.662 L62.9774484,219.153748 C62.9774484,219.776413 62.4809815,220.276083 61.8792033,220.276083 L57.290645,220.276083 C56.6813447,220.28377 56.1923999,219.776413 56.1923999,219.161435 Z M86.1534291,209.99057 C85.8374955,210.328808 85.7773177,210.843852 86.018029,211.243588 C86.018029,211.251276 86.3264403,211.789382 86.3640514,212.527356 C86.416707,213.534383 85.9428067,214.426101 84.9498728,215.187137 C84.5963281,215.463877 84.4534058,215.940486 84.6038504,216.37097 C84.6038504,216.378658 84.9273061,217.393372 84.4007502,218.354276 C83.896761,219.276743 82.7759493,219.937845 81.075926,220.306832 C79.714403,220.606634 77.8639352,220.660445 75.5922227,220.475951 C75.5621338,220.475951 75.5245227,220.475951 75.4869115,220.475951 C70.6501197,220.583572 65.7606723,219.937845 65.7080168,219.930158 L64.9407496,219.837911 C64.985883,219.622669 65.0084497,219.392052 65.0084497,219.161435 L65.0084497,206.662 C65.0084497,206.331449 64.9557941,206.008585 64.8655274,205.708783 C65.0009274,205.193739 65.3770388,204.048341 66.2646615,203.072063 C69.6421413,200.33541 72.9443989,191.103047 73.0873212,190.703311 C73.147499,190.541879 73.1625435,190.365073 73.1324546,190.188267 C73.0045767,189.327297 73.0497101,188.274146 73.2302435,187.95897 C73.6289215,187.966657 74.7046,188.081966 75.3515115,188.996746 C76.1187786,190.080645 76.0886897,192.017827 75.2612447,194.585362 C73.9975106,198.498162 73.8921995,200.558339 74.8926556,201.465432 C75.3891226,201.918979 76.0510785,201.942041 76.5325011,201.765234 C76.9913569,201.657613 77.427646,201.565366 77.8413685,201.496181 C77.8714574,201.488494 77.9090685,201.480807 77.9391575,201.47312 C80.2484811,200.958075 84.3857058,200.642899 85.8224511,201.980477 C87.0410518,203.118187 86.1759958,204.624884 86.0782068,204.786316 C85.7998844,205.2168 85.8826289,205.777968 86.2587402,206.123893 C86.2662625,206.131581 87.0560963,206.892616 87.0937074,207.915018 C87.1237963,208.599181 86.8078628,209.298719 86.1534291,209.99057 Z" id="Shape" transform="translate(71.644971, 204.278958) rotate(-165.000000) translate(-71.644971, -204.278958) "></path>
                </g>
              </g>
            </svg>
          </a>
          <span class="entry-media__votes__num">{{ entry.votes }}</span>
        </div>
        <h1>{{ entry.title }}</h1>
        <span class="entry-media__address">{{ entry.address }}</span>
        <a v-if="isLoggedIn && entry.user._id == userData._id" class="btn" :href="'/edit/' + entry._id">Edit Spot</a>
      </div>
      <div class="carousel-cell entry-media__image">
        <img :src="entry.photo.large.url">
      </div>
      <div class="carousel-cell entry-media__maps">
        <div class="gmaps" id="gmaps" ref="gmaps"></div>
      </div>
    </div>
  </div>
</template>

<script>

import Flickity from 'flickity';
import 'flickity-imagesloaded';
import mapstyle from '@/assets/gmaps.json';
import GoogleMapsLoader from 'google-maps';

export default {
  name: 'c-entry-media',
  props: ['entry', 'userData', 'hasVoted', 'isLoggedIn'],
  components: {
  },
  data () {
    return {
      showMap: false,
      isExpanded: false
    }
  },

  computed: {
  },

  watch: {
    'entry': function(to, from) {
      if(this.entry.coords) this.initMap();
      if(this.entry.coords) this.initSlideshow();
    },
    'isExpanded': function(to, from) {
      setTimeout(() => {
        google.maps.event.trigger(this.map, 'resize');
      }, 200);
      if(to) {
        document.body.style.overflow = 'hidden';
      }else{
        document.body.style.overflow = 'auto';
      }
    }
  },

  mounted() {
    // this.initMap();
  },

  methods: {

    initMap() {
      GoogleMapsLoader.KEY = 'AIzaSyD5iWyE6nsYCAhyRnL58aFFoFhAI9rcwBI';
      GoogleMapsLoader.LANGUAGE = 'de';

      GoogleMapsLoader.load(function(google) {
        this.google = google;

        this.map = new google.maps.Map(this.$refs.gmaps, {
          center: this.entry.coords,
          zoom: 15,
          disableDefaultUI: false,
          clickableIcons: false,
          gestureHandling: 'greedy',
          styles: mapstyle,
          scrollwheel: false,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
          fullscreenControl: false
        });

        this.addMarker();

      }.bind(this));
    },

    addMarker() {
      this.marker = new this.google.maps.Marker({
        position: this.entry.coords,
        map: this.map,
        draggable: true
      });
    },

    initSlideshow() {
      var flkty = new Flickity( '.main-carousel', {
        imagesLoaded: true,
        prevNextButtons: false,
        pageDots: false,
        cellAlign: 'left'
      });
    }

  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.carousel-cell {
  height: 16rem;
  width: auto;

  @include tablet {
    height: 30rem;
  }
}

.entry-media {
  margin-bottom: 2rem;
  position: relative;
  display: block;
  width: 100%;
  height: 16rem;

  &__titlecard {
    width: 300px;
    padding: 2rem;
    box-sizing: border-box;

    h1 {
      text-align: left;
      font-size: 1.5rem;
      margin: 0;
      margin-bottom: .5rem;
      line-height: 1.2;
      font-weight: 700;
      hyphens: auto;
    }
  }
  &__image {
    width: auto;
    height: 100%;
    position: relative;

    img {
      display: block;
      width: auto;
      height: 100%;
    }
  }
  .gmaps {
    width: 25rem;
    height: 100%;
  }
  &__address {
    font-size: .9rem;
    color: $c-grey-darkest;
  }
  &__votes {
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    align-items: center;

    &__button {
      display: inline-block;
      position: relative;
      width: 3.3rem;
      height: 3.3rem;
      border: 2px solid $c-highlight;
      border-radius: 99%;
      transition: .3s $easeOutQuint transform;

      svg {
        width: 2rem;
        height: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        transition: .3s $easeOutQuint transform;
      }

      &:hover {
        transform: scale(1.1);

        svg {
          transform: rotate(-10deg);
        }
      }
    }
    &__num {
      font-weight: 700;
      color: $c-highlight;
      margin-left: .75rem;
      position: relative;

      &::before {
        content: "";
        display: block;
        position: absolute;
        top: -.75rem;
        left: 50%;
        width: 0;
        height: 0;
        margin-left: -5px;
        border: solid transparent;
        pointer-events: none;
        border-width: 5px;
        border-bottom-color: $c-highlight;
      }
    }

    &.disabled {
      pointer-events: none;
      opacity: .5;
    }
    &.is-active {

      .entry-media__votes__button {
        background-color: $c-highlight;

        svg path {
          fill: white;
        }
      }
      &.famed {
        .entry-media__votes__button {
          background-color: $c-main;

          svg path {
            fill: white;
          }
        }
      }
    }
    &.famed {
      .entry-media__votes__button {
        border-color: $c-main;

        svg {
          transform: rotate(150deg);
        }
        svg path {
          fill: $c-main;
        }
        &:hover {
          svg {
            transform: rotate(160deg);
          }
        }
      }
      .entry-media__votes__num {
        color: $c-main;
        &::before {
          border-bottom-color: $c-main;
        }
      }
    }
  }

  @include tablet {
    height: 30rem;
    margin-bottom: 2rem;

    &__titlecard {
      width: 25rem;

      h1 {
        font-size: 2.25rem;
      }
    }
  }
}

</style>
