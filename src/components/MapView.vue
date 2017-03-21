<template>
  <div class="map">
    <div class="mapbox" id="mapbox"></div>
    <a :href="'#/entry/' + entry.id" class="marker" ref="entry" v-for="entry in entries"></a>
  </div>
</template>

<script>
import MapInfoView from '@/components/MapInfoView'

import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

export default {
  name: 'map-view',
  props: ['entries'],
  components: {
    'map-info': MapInfoView
  },

  data () {
    return {
      activeEntry: []
    }
  },

  mounted() {
    this.initMap();
  },

  methods: {

    initMap() {
      mapboxgl.accessToken = 'pk.eyJ1IjoiZGlsdW5vIiwiYSI6ImJfVy1TSm8ifQ.GY6YpNmT1_YnF7bstpyYmQ';

      this.map = new mapboxgl.Map({
          container: 'mapbox',
          style: 'mapbox://styles/mapbox/light-v9',
          center: [8.5314407, 47.377235],
          zoom: 13
      });

      this.renderMarkers();
      this.locateUser();

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

      let coords = [loc.coords.longitude, loc.coords.latitude];
      let el = document.createElement('div');
      el.className = 'marker-user';

      let marker = new mapboxgl.Marker(el)
        .setLngLat(coords)
        .addTo(this.map);

      this.map.flyTo({
        center: coords
      });

    },

    renderMarkers() {
      this.entries.forEach((entry, index) => {

        // let el = document.createElement('a');
        // el.href = '#';
        // el.className = 'marker';

        let el = this.$refs.entry[index];

        let marker = new mapboxgl.Marker(el, {
            offset: [-5, -5]
          })
          .setLngLat(entry.coords)
          .addTo(this.map);

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
.mapbox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}


</style>
