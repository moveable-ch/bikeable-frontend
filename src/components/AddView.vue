<template>
  <div class="add">
    <h1>Neuer Beitrag</h1>
    <input type="text" placeholder="Adresse" v-model="entryAddress" v-bind:class="{ inactive: addressPending }" v-on:blur="checkAddress">
    <button class="btn-location" v-on:click="getUserAddress" v-bind:class="{ hidden: !userCoords }">My Location</button><br>
    <small>Coordinates: {{ entryCoords }}</small>
    <textarea placeholder="Beschreibung" v-model="entryText"></textarea>
    <input type="submit" value="OK">
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

.add {
  max-width: 700px;
  margin: 1rem auto;
}

input[type=text], textarea {
  display: block;
  width: 100%;
  max-width: 500px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1rem;
  padding: .5rem;
  margin: 1rem 0;
  border: 2px solid #ccc;

  &:focus {
    outline: none;
    border-color: #000;
  }

  &.inactive {
    pointer-events: none;
    background-color: #ccc;
    color: #666;
  }
}

input[type=submit] {
  background-color: #333;
  border: none;
  border-radius: 0;
  color: #fff;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1rem;
  padding: .5rem 2rem;
}

.btn-location {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 1rem;
  border: none;
  background-color: #ccc;
  padding: .5rem 1rem;

  &.hidden {
    pointer-events: none;
    opacity: .4;
  }
}

</style>
