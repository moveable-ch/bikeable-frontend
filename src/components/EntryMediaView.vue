<template>
  <div class="entry-media">
    <a
      class="switch-btn"
      @click.prevent="showMap = !showMap"
      v-bind:class="{ active: showMap }"
      href="#">
    </a>
    <div v-bind:class="{ visible: !showMap }" class="entry-media__image">
      <img :src="img">
    </div>
    <div v-bind:class="{ visible: showMap }" class="entry-media__map">
      <div class="gmaps" id="gmaps" ref="gmaps"></div>
    </div>
  </div>
</template>

<script>

import mapstyle from '@/assets/gmaps.json';
import GoogleMapsLoader from 'google-maps';

export default {
  name: 'entry-media-view',
  props: ['img', 'coords'],
  components: {
  },
  data () {
    return {
      showMap: true
    }
  },

  computed: {
  },

  watch: {
  },

  mounted() {
    this.initMap();
  },

  methods: {

    initMap() {
      GoogleMapsLoader.KEY = 'AIzaSyD5iWyE6nsYCAhyRnL58aFFoFhAI9rcwBI';
      GoogleMapsLoader.LANGUAGE = 'de';

      GoogleMapsLoader.load(function(google) {
        this.google = google;

        this.map = new google.maps.Map(this.$refs.gmaps, {
          center: this.coords,
          zoom: 15,
          disableDefaultUI: false,
          clickableIcons: false,
          gestureHandling: 'greedy',
          styles: mapstyle,
          scrollwheel: false
        });

        this.addMarker();

      }.bind(this));
    },

    addMarker() {
      this.marker = new this.google.maps.Marker({
        position: this.coords,
        map: this.map,
        draggable: true
      });
    }

  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.entry-media {
  display: block;
  margin: 0 auto;
  margin-bottom: 1rem;
  width: 100%;
  height: 15rem;
  background-color: #fff;
  position: relative;

  .switch-btn {
    display: block;
    width: 40px;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    background-color: #333;
    background-image: url('../assets/mapbutton.png');
    background-size: 60%;
    background-repeat: no-repeat;
    background-position: center;

    &.active {
      background-image: url('../assets/imagebutton.png');
    }
    &:hover {
      background-color: $c-main;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    display: none;

    &.visible {
      display: flex;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
    }
  }

  &__map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: none;

    &.visible {
      display: block;
    }

    .gmaps {
      height: 100%;
      width: 100%;
    }
  }


  @include desktop() {
    height: 30rem;
    margin-bottom: 0;

    &__image {

      img {
        max-width: calc(100% - 2rem);
        max-height: calc(100% - 2rem);
      }
    }
  }
}

</style>
