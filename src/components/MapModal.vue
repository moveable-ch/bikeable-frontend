<template>
  <transition name="modal">
    <div class="map-modal" @click="$emit('close')">
      <div class="map-modal__inner" v-if="coords" @click.stop>
        <div class="map-modal__map" ref="gmaps"></div>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>
    </div>
  </transition>
</template>

<script>

import mapstyle from '@/assets/gmaps.json';
import GoogleMapsLoader from 'google-maps';

export default {
  name: 'c-map-modal',
  props: ['coords'],
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
    coords() {
      if(!this.coords) return;
      this.initMap();
    }
  },
  mounted() {
    if(this.coords) {
      this.initMap();
    }
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
            position: google.maps.ControlPosition.LEFT_TOP,
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
    },
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.map-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;

  &__content {
    overflow: hidden;
    width: calc(100% - 5rem);
    padding: .5rem 1rem;
  }
  &__map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &__inner {
    background-color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 1rem;
    width: 90%;
    height: 90%;
    max-width: 50rem;
    max-height: 40rem;
    position: relative;
    border-radius: 6px;
    box-shadow: 0 6px 6px -4px rgba(#000, .3);
    border: 1px solid $c-grey;

    .btn-close {
      font-size: 1.5rem;
      font-weight: 600;
      padding: 0;
      background: none;
      border: none;
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: #fff;
      width: 3rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      z-index: 0;
      cursor: pointer;
      border-radius: 99%;
      box-shadow: 0 6px 6px -4px rgba(#000, .3);

      &:active, &:focus {
        outline: none;
        color: $c-main;
      }
      &:hover {
        color: $c-main;
      }
    }
  }
}

.modal-enter-active, .modal-leave-active {
  transition: .4s opacity;

  .map-modal__inner {
    transition: .4s transform ease-out;
  }
}
.modal-enter, .modal-leave-to {
  opacity: 0;

  .map-modal__inner {
    transform: translateY(40px);
  }
}

</style>
