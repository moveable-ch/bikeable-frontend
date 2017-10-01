<template>
  <div class="entry-media" v-bind:class="{ 'is-expanded': isExpanded }">
    <div class="controls">
      <a
        class="controls__btn controls__btn--view"
        @click.prevent="showMap = !showMap"
        v-bind:class="{ active: showMap }"
        href="#">
        <span class="sr-only">Switch View</span>
      </a>
      <a
        class="controls__btn controls__btn--expand"
        @click.prevent="isExpanded = !isExpanded"
        v-bind:class="{ active: isExpanded }"
        href="#">
        <span class="sr-only">Fullscreen</span>
      </a>
    </div>
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
  name: 'c-entry-media',
  props: ['img', 'coords', 'famed'],
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
  position: absolute;
  top: -1rem;
  left: 0;
  display: block;
  margin: 1rem auto;
  width: 100%;
  height: 15rem;
  background-color: $c-black;
  overflow: hidden;
  z-index: 2;
  transition: .1s height $easeOutQuint, .1s width $easeOutQuint, .1s top, .1s left;

  &.is-expanded {
    height: calc(100vh - 3rem);
    width: 100vw;
    position: fixed;
    z-index: 5;
    top: 3rem;
    left: 0;
    margin: 0;

    @include desktop() {
      top: 5rem;
      height: calc(100vh - 5rem);
    }
  }

  .is-famed & {
    // border-color: $c-main;
  }

  .controls {
    position: absolute;
    bottom: 4px;
    right: 4px;
    z-index: 1;
    display: flex;

    &__btn {
      display: block;
      width: 40px;
      height: 40px;
      background-color: lighten($c-black, 10%);
      border: 1px solid lighten($c-black, 25%);
      border-radius: 4px;
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
      margin-left: 4px;

      &:hover {
        background-color: lighten($c-black, 15%);
      }

      &--view {
        background-image: url('../assets/mapbutton.png');
        @include retina {
          background-image: url('../assets/mapbutton@2x.png');
        }

        &.active {
          background-image: url('../assets/imagebutton.png');
          @include retina {
            background-image: url('../assets/imagebutton@2x.png');
          }
        }
      }
      &--expand {
        background-image: url('../assets/expandbutton.png');
        @include retina {
          background-image: url('../assets/expandbutton@2x.png');
        }

        &.active {
          background-image: url('../assets/collapsebutton.png');
          @include retina {
            background-image: url('../assets/collapsebutton@2x.png');
          }
        }
      }
    }
  }
  .expand-btn {
    position: absolute;
    bottom: 0;
    right: 42px;
    z-index: 1;
    width: 40px;
    height: 40px;
    background-color: $c-main;
  }
  .switch-btn {
    display: block;
    width: 40px;
    height: 40px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
    background-color: $c-highlight;
    background-image: url('../assets/mapbutton.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;

    @include retina {
      background-image: url('../assets/mapbutton@2x.png');
    }

    &.active {
      background-image: url('../assets/imagebutton.png');

      @include retina {
        background-image: url('../assets/imagebutton@2x.png');
      }
    }
    // &:hover {
    //   background-color: $c-main;
    // }

    .is-famed & {
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
    display: flex;

    // &.visible {
    //   display: flex;
    // }

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
    transform: translateX(101%);
    transition: .5s transform $easeOutQuint;

    &.visible {
      transform: translateX(0);
    }

    .gmaps {
      height: 100%;
      width: 100%;
    }
  }


  @include desktop() {
    height: 25rem;
    margin: 0 auto;
    top: 2rem;
    left: 2rem;
    width: calc(100% - 2rem);

    &__image {

      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }
}

</style>
