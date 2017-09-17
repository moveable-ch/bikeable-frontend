<template>
  <transition name="modal">
    <div class="map-modal" @click="$emit('close')">
      <div class="map-modal__inner" @click.stop>
        <button class="btn-close" @click="$emit('close')">✕</button>
        <div class="gmaps" id="gmaps" ref="gmaps"></div>
        <div class="map-modal__content">
          <p>Ziehe den Pin auf den gewünschten Standort</p>
          <a class="btn" href="#" @click.prevent="setLocation">OK</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import mapstyle from '@/assets/gmaps.json';
import GoogleMapsLoader from 'google-maps';

export default {
  name: 'map-modal-view',
  props: ['propCoords'],
  data () {
    return {
      currentCoords: null
    }
  },
  computed: {
    userCoords() {
      return this.$store.getters.userCoords
    }
  },
  watch: {
    'userCoords': function() {
      this.locateUser();
    }
  },
  mounted() {
    this.initCoords();
    this.initMap();
  },
  methods: {
    setLocation() {

      let lat = this.marker.position.lat();
      let lng = this.marker.position.lng();

      let c = {
        lat: lat,
        lng: lng
      };

      this.$emit('setCoords', c);
      this.$emit('close');

    },
    initCoords() {
      if(this.propCoords) {
        this.currentCoords = this.propCoords;
        return;
      }else if(this.userCoords) {
        this.currentCoords = this.userCoords;
        return;
      }else{
        this.currentCoords = {lat: 47.377235, lng: 8.5314407};
      }
    },
    initMap() {
      GoogleMapsLoader.KEY = 'AIzaSyD5iWyE6nsYCAhyRnL58aFFoFhAI9rcwBI';
      GoogleMapsLoader.LANGUAGE = 'de';

      GoogleMapsLoader.load(function(google) {
        this.google = google;

        this.map = new google.maps.Map(this.$refs.gmaps, {
          center: this.currentCoords,
          zoom: 15,
          disableDefaultUI: false,
          clickableIcons: false,
          gestureHandling: 'greedy',
          styles: mapstyle
        });

        this.addMarker();
        this.locateUser();

        this.map.addListener('click', (e) => {
          console.log(this.marker.position, e.latLng);
          this.marker.setPosition(e.latLng);
        });

      }.bind(this));
    },
    locateUser() {

      if(!this.userCoords) return;

      let icon = {
        url: 'static/img/userloc.png',
        scaledSize: new this.google.maps.Size(17, 17)
      }

      var marker = new this.google.maps.Marker({
        position: this.userCoords,
        map: this.map,
        icon: icon
      });

    },
    addMarker() {
      this.marker = new this.google.maps.Marker({
        position: this.currentCoords,
        map: this.map,
        draggable: true
      });
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.map-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#333, .8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  padding-top: 4rem;
  box-sizing: border-box;

  @include desktop() {
    // padding-top: 9rem;
    padding-top: 0;
    z-index: 2;
  }

  &__inner {
    background-color: #fff;
    display: flex;
    width: 95%;
    height: 95%;
    margin: 0 1rem;
    position: relative;

    @include desktop() {
      width: 80%;
      height: 80%;
    }

    .btn-close {
      font-size: 1rem;
      padding: 0;
      background: none;
      border: none;
      position: absolute;
      top: 0;
      right: 0;
      background-color: #fff;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      z-index: 1;
      cursor: pointer;
      border-left: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      display: none;

      &:active, &:focus {
        outline: none;
        color: $c-main;
      }
    }
  }
  .gmaps {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 6rem);
  }
  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 6rem;
    text-align: center;
    box-sizing: border-box;

    p {
      font-size: .8rem;
      max-width: none;
      color: #888;
      margin-bottom: .5rem;
      margin-top: .5rem;
    }
  }
}

.modal-enter-active, .modal-leave-active {
  transition: 1s opacity;

  .map-modal__inner {
    transition: 1s transform $easeOutQuint;
  }
}
.modal-enter, .modal-leave-to {
  opacity: 0;

  .map-modal__inner {
    transform: translateY(100%);
    transition: .6s transform $easeInQuint;
  }
}

</style>
