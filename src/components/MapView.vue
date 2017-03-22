<template>
  <div class="map">
    <div class="gmaps" id="gmaps" ref="gmaps"></div>
    <a :href="'#/entry/' + entry.id" class="marker" ref="entry" v-for="entry in entries"></a>
  </div>
</template>

<script>
import MapInfoView from '@/components/MapInfoView';
import mapstyle from '@/assets/gmaps.json';

import GoogleMapsLoader from 'google-maps';

export default {
  name: 'map-view',
  props: [],
  components: {
    'map-info': MapInfoView
  },

  computed: {
    entries() {
      return this.$store.state.entries
    }
  },

  data () {
    return {
      activeEntry: []
    }
  },

  mounted() {
    this.initMap();
  },

  watch: {
    'entries': function() {
      this.renderMarkers();
    }
  },

  methods: {

    initMap() {
      // mapboxgl.accessToken = 'pk.eyJ1IjoiZGlsdW5vIiwiYSI6ImJfVy1TSm8ifQ.GY6YpNmT1_YnF7bstpyYmQ';

      // this.map = new mapboxgl.Map({
      //     container: 'mapbox',
      //     style: 'mapbox://styles/mapbox/light-v9',
      //     center: [8.5314407, 47.377235],
      //     zoom: 13
      // });

      GoogleMapsLoader.KEY = 'AIzaSyD5iWyE6nsYCAhyRnL58aFFoFhAI9rcwBI';
      GoogleMapsLoader.LANGUAGE = 'de';

      GoogleMapsLoader.load(function(google) {
          this.google = google;

          this.map = new google.maps.Map(this.$refs.gmaps, {
          center: {lat: 47.377235, lng: 8.5314407},
          zoom: 15,
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
          styles: mapstyle
        });

        this.renderMarkers();
        this.locateUser();
      }.bind(this));


    },

    locateUser() {
      if (navigator.geolocation) {
        let timeoutVal = 10 * 1000 * 1000;

        navigator.geolocation.getCurrentPosition(
          function(loc) {
            // Success
            this.handleUserLocation(loc);

          }.bind(this),
          function(e) {
            // Error
            console.log('error');
          },
          { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
        );
      }
    },

    handleUserLocation(loc) {

      let coords = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude
      };

      var marker = new this.google.maps.Marker({
        position: coords,
        map: this.map
      });

      // console.log(coords);
      // this.map.panTo(coords);

    },

    renderMarkers() {

      this.entries.forEach((entry, index) => {

        var marker = new this.google.maps.Marker({
          position: entry.coords,
          map: this.map
        });

      });

    }

  }
}
</script>

<style lang="scss" scoped>

.map {
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: calc(100vh - 50px);
  background-color: #fff;
}
.gmaps {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}


</style>
