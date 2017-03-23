<template>
  <div class="add">
    <h1>Neuer Beitrag</h1>
    <input type="text" placeholder="Adresse" v-model="entryAddress" v-bind:class="{ inactive: addressPending }" v-on:blur="checkAddress">
    <button class="btn" v-bind:class="{ disabled: !userCoords }" v-on:click="getUserAddress">My Location</button><br>
    <small>Coordinates: {{ entryCoords }}</small>
    <textarea placeholder="Beschreibung" v-model="entryText" rows="5"></textarea>
    <button class="btn disabled" disabled>OK</button>
  </div>
</template>

<script>
export default {
  name: 'add-view',
  data () {
    return {
      addressPending: false,

      entryAddress: '',
      entryCoords: null,
      entryText: ''
    }
  },

  computed: {
    userCoords() {
      return this.$store.state.userCoords
    }
  },

  watch: {
    'userCoords': function() {
      // this.handleUserCoords();
    }
  },

  mounted() {
    // this.handleUserCoords();
  },

  methods: {
    handleUserCoords() {
      if(!this.userCoords || this.entryAddress != '') {
        this.addressPending = false;
      } else {
        this.getUserAddress();
      }
    },
    getUserAddress() {
      let coords = this.userCoords.lat + ',' + this.userCoords.lng;

      this.$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+coords+'&key=AIzaSyDSPhuEAL3Hv0zmbnhGQlTu9ax0uLXmuOE').then(response => {
        if(response.body.results[0].formatted_address != '') {
          this.entryAddress = response.body.results[0].formatted_address;
          this.entryCoords = this.userCoords;
        }

        this.addressPending = false;
      }, response => {
        console.log(response);
        this.clearAddress();
      });
    },
    checkAddress() {
      this.addressPending = true;
      if(this.entryAddress == '') {
        this.clearAddress();
        return;
      }

      this.$http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.entryAddress + '&key=AIzaSyDSPhuEAL3Hv0zmbnhGQlTu9ax0uLXmuOE').then(response => {
        if(response.body.results[0]) {
          this.entryAddress = response.body.results[0].formatted_address;
          this.entryCoords = response.body.results[0].geometry.location;
        } else {
          this.clearAddress();
        }
        this.addressPending = false;
      }, response => {
        console.log(response);
        this.clearAddress();
      });
    },
    clearAddress() {
      this.entryAddress = '';
      this.entryCoords = null;
      this.addressPending = false;
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.add {
  max-width: 700px;
  margin: 2rem 0;
  padding: 0 1rem;

  @include desktop() {
    padding: 0 2rem;
  }
}

h1 {
  margin-bottom: 2rem;
}


</style>
