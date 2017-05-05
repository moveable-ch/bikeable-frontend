<template>
  <div class="map">
    <entry-modal-view v-if="showModal" @close="showModal = false" :entryId="activeEntryId"></entry-modal-view>
    <div class="gmaps" id="gmaps" ref="gmaps"></div>
    <div class="spot-nav clearfix">
      <router-link v-if="isLoggedIn" to="/add" class="spot-nav__link spot-nav__link--add"></router-link>
      <a href="#" @click.prevent="showUserLocation" class="spot-nav__link spot-nav__link--location" v-bind:class="{ disabled: !userCoords }"></a>
    </div>
  </div>
</template>

<script>
import EntryModalView from '@/components/EntryModalView';
import mapstyle from '@/assets/gmaps.json';

import GoogleMapsLoader from 'google-maps';

export default {
  name: 'map-view',
  props: [],
  components: {
    'entry-modal-view': EntryModalView
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
      activeEntryId: null,
      markers: [],
      showModal: false
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
          disableDefaultUI: false,
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
        map: this.map,
        icon: 'static/img/userloc.png'
      });

    },

    showUserLocation() {

      if(!this.userCoords) return;

      this.map.setCenter(this.userCoords);

    },

    renderMarkers() {

      if(!this.entries || !this.google) return;

      this.markers = [];

      this.entries.forEach((entry, index) => {

        let imgurl = 'static/img/smile-bad.png';

        if(entry.famed) imgurl = 'static/img/smile-good.png';

        let marker = new this.google.maps.Marker({
          position: entry.coords,
          map: this.map,
          icon: imgurl,
          size: new google.maps.Size(20, 32)
        });

        marker.addListener('click', function(m) {
          this.activeEntryId = entry._id;
          this.showModal = true;
          // this.$router.push({ name: 'entry', params: { id: entry._id }});
        }.bind(this));

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

.spot-nav {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);

  &__link {
    display: block;
    width: 4rem;
    height: 4rem;
    background-color: $c-blue;
    color: #eee;
    text-decoration: none;
    text-align: center;
    float: left;
    margin: 0 2px;
    position: relative;

    &:hover {
      background-color: $c-main;
      color: #fff;
    }
    &.disabled {
      opacity: .2;
      pointer-events: none;
    }

    &--add {
      &::before {
        content: "+";
        font-family: Arial;
        font-size: 3rem;
        line-height: 4rem;
      }
    }
    &--location {
      &::before {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-image: url('../assets/locatebutton.png');
        background-size: 40px 40px;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
  }
}

</style>
