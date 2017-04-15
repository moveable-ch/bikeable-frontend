<template>
  <div class="map">
    <div class="gmaps" id="gmaps" ref="gmaps"></div>
    <div class="spot-nav clearfix">
      <router-link v-if="isLoggedIn" to="/add" class="spot-nav__add"></router-link>
      <router-link to="/" class="spot-nav__link">Zur Liste</router-link>
    </div>
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
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },

  data () {
    return {
      activeEntry: [],
      markers: []
    }
  },

  mounted() {
    this.initMap();
  },

  beforeDestroy() {
    this.markers.forEach((marker) => {
      // marker.removeListener('click');
    });
    this.markers = [];
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

        this.renderMarkers();
        this.locateUser();

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

      if(!this.entries || !this.google) return;

      this.markers = [];

      this.entries.forEach((entry, index) => {

        var marker = new this.google.maps.Marker({
          position: entry.coords,
          map: this.map
        });

        marker.addListener('click', function(m) {
          this.$router.push({ name: 'entry', params: { id: entry._id }})
        }.bind(this));

        // this.markers.push(marker);

      });

    }

  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - 3rem);
  background-color: #fff;

  @include desktop {
    top: 9rem;
    height: calc(100vh - 9rem);
  }
}
.gmaps {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}


</style>
