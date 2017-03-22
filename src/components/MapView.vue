<template>
  <div class="map">
    <div class="gmaps" id="gmaps" ref="gmaps"></div>
    <router-link to="/add" class="link-add"></router-link>
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
    },
    userCoords() {
      return this.$store.state.userCoords
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
    },
    'userCoords': function() {
      this.locateUser();
    }
  },

  methods: {

    initMap() {

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
      }.bind(this));


    },


    locateUser() {

      if(!this.userCoords) return;

      var marker = new this.google.maps.Marker({
        position: this.userCoords,
        map: this.map
      });

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
