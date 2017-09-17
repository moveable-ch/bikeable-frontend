<template>
  <div class="map">
    <entry-modal-view v-if="showModal" @close="showModal = false" :entryId="activeEntryId"></entry-modal-view>
    <sponsor-modal-view v-if="showSponsorModal" @close="showSponsorModal = false" :sponsoredEntry="activeSponsor"></sponsor-modal-view>
    <add-modal-view v-if="showAddModal" @close="showAddModal = false" :coords="clickedCoords"></add-modal-view>
    <div class="gmaps" id="gmaps" ref="gmaps"></div>
    <div class="spot-nav clearfix" v-if="!isEmbed">
      <router-link v-if="isLoggedIn" to="/add" class="spot-nav__link spot-nav__link--add"></router-link>
      <a href="#" @click.prevent="showUserLocation" class="spot-nav__link spot-nav__link--location" v-bind:class="{ disabled: !userCoords }"></a>
    </div>
  </div>
</template>

<script>
import EntryModalView from '@/components/EntryModalView';
import SponsorModalView from '@/components/SponsorModalView';
import AddModalView from '@/components/AddModalView';
import mapstyle from '@/assets/gmaps.json';

import GoogleMapsLoader from 'google-maps';

export default {
  name: 'map-view',
  metaInfo: {
    title: 'Map — Bikeable'
  },
  props: [],
  components: {
    'sponsor-modal-view': SponsorModalView,
    'entry-modal-view': EntryModalView,
    'add-modal-view': AddModalView
  },

  computed: {
    entries() {
      return this.$store.getters.allSpots;
    },
    sponsors() {
      return this.$store.getters.sponsoredEntries
    },
    userCoords() {
      return this.$store.getters.userCoords
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    isEmbed() {
      return this.$route.query.embed;
    }
  },

  data () {
    return {
      activeEntryId: null,
      activeSponsor: null,
      clickedCoords: null,
      showModal: false,
      showAddModal: false,
      showSponsorModal: false
    }
  },

  mounted() {
    this.$store.dispatch('getSponsoredEntries');
    this.$store.dispatch('getAllSpots');
    this.initMap();
  },

  beforeDestroy() {
  },

  watch: {
    'entries': function() {
      this.renderMarkers();
    },
    'sponsors': function() {
      this.renderSponsors();
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

        // this.map.addListener('click', function(e) {
        //   let lat = e.latLng.lat();
        //   let lng = e.latLng.lng();

        //   this.clickedCoords = {
        //     lat: lat,
        //     lng: lng
        //   };
        //   this.showAddModal = true;
        // }.bind(this));

        this.renderMarkers();
        this.renderSponsors();
        this.locateUser();

      }.bind(this));

    },


    locateUser() {

      if(!this.userCoords || !this.google) return;

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

    showUserLocation() {

      if(!this.userCoords) return;

      this.map.setCenter(this.userCoords);

    },

    renderSponsors() {

      if(!this.sponsors || !this.google) return;

      this.sponsors.forEach((entry, index) => {

        let imgurl = 'static/img/star-lame.png';
        if(entry.isSponsor) imgurl = 'static/img/star.png';

        let size = 12;
        if(entry.isSponsor) size = 16;

        let icon = {
          url: imgurl,
          scaledSize: new google.maps.Size(size, size)
        }

        let marker = new this.google.maps.Marker({
          position: entry.location,
          map: this.map,
          icon: icon
        });

        marker.addListener('click', function(m) {
          this.activeSponsor = entry;
          this.showSponsorModal = true;
          // this.$router.push({ name: 'entry', params: { id: entry._id }});
        }.bind(this));

      });

    },

    renderMarkers() {

      if(!this.entries || !this.google) return;

      this.entries.forEach((entry, index) => {

        let imgurl = 'static/img/marker-bad.png';

        if(entry.famed) imgurl = 'static/img/marker-good.png';

        let icon = {
          url: imgurl,
          scaledSize: new google.maps.Size(22, 30)
        }

        let marker = new this.google.maps.Marker({
          position: entry.coords,
          map: this.map,
          icon: icon
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
    top: 5rem;
    height: calc(100vh - 5rem);
  }

  .embed & {
    height: 100vh;
    top: 0;
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
    background-color: #444;
    color: #eee;
    text-decoration: none;
    text-align: center;
    float: left;
    margin: 0 2px;
    position: relative;
    // border-radius: 4px;

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
