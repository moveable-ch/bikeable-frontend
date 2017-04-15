<template>
  <div class="add">
    <div class="container">
      <h1>Spot hinzufügen</h1>
      <form @submit.prevent="postEntry">
        <input type="text" placeholder="Adresse" v-model="entryAddress" v-bind:class="{ inactive: addressPending }" v-on:blur="checkAddress">
        <button class="btn" v-bind:class="{ disabled: !userCoords }" v-on:click="getUserAddress">My Location</button><br>
        <div class="file-upload">
          <h3>Bild hochladen</h3>
          <input v-on:change="uploadImage" type="file">
          <span v-if="imageId">{{ imageId }}</span>
          <div class="file-upload__preview">
            <img v-bind:src="imagePreviewUrl">
          </div>
        </div>
        <input type="text" v-model="entryTitle" placeholder="Titel">
        <textarea placeholder="Beschreibung" v-model="entryText" rows="5"></textarea>
        <label><input type="checkbox" v-model="entryFamed" name="famed">Famed</label><br>
        <button type="submit" class="btn" v-bind:class="{ disabled: !formReady }" :disabled="!formReady">OK</button>
      </form>
    </div>
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
      entryTitle: '',
      entryText: '',
      entryFamed: true,
      imagePreviewUrl: '',
      imageId: ''
    }
  },

  computed: {
    userCoords() {
      return this.$store.state.userCoords
    },
    formReady() {
      return (this.entryAddress != '' && this.entryTitle != '' && this.entryText != '' && this.imageId != '');
    }
  },

  watch: {
    'imageId': function() {
      // if(this.imageId != '') {
      //   this.imagePreviewUrl = 'https://backend.bikeable.ch/api/v1/photos/' + this.imageId + '/?size=medium'
      // }
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
    },
    uploadImage(e) {
      e.preventDefault();
      let imageFile = e.currentTarget;
      let file = imageFile.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (fileLoadEvent) => {
        this.$store.dispatch('uploadImage', {
          data: reader.result
        })
        .then((data) => {
            this.imageId = data.body.data.imageId;
          }, (data) => {
            console.log('error', data);
          });
      };
    },
    postEntry(e) {
      if(!this.formReady) return;

      this.$store.dispatch('postEntry', {
          title: this.entryTitle,
          text: this.entryText,
          imageId: this.imageId,
          address: this.entryAddress,
          coords: this.entryCoords,
          famed: this.entryFamed
        })
      .then((data) => {
          // console.log('success', data);
          console.log(data);
        }, (data) => {
          console.log('error', data);
          // this.message = data.body.message;
        });
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.add {
  margin: 2rem 0;
}

h1 {
  margin-bottom: 2rem;
}

.file-upload {
  padding: 1rem;
  padding-bottom: 0;
  background-color: #fff;
  margin: 1rem 0;
  max-width: 500px;
  box-sizing: border-box;
  border: 2px solid #ccc;

  span {
    background-color: $c-main;
    color: #fff;
    font-size: .75rem;
    color: #fff;
    padding: .5rem 1rem;
  }

  &__preview {
    width: 15rem;
    height: 10rem;
    background-color: #aff;
    display: none;

    img {
      max-width: 100%;
      max-height: 100%;
      height: auto;
      width: auto;
    }
  }
}


</style>
