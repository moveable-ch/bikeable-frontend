<template>
  <div class="add">
    <div class="container">
      <h1>Spot hinzufügen</h1>
      <form @submit.prevent="postEntry">
        <label class="label-address">
          <span>Adresse</span>
          <input type="text" v-model="entryAddress" v-bind:class="{ inactive: addressPending }" v-on:blur="checkAddress">
          <a href="#" title="Meinen Standort benutzen" class="userloc" v-bind:class="{ disabled: !userCoords }" @click.prevent="handleUserCoords"></a><br>
        </label>
        <span class="label">Bild hochladen</span>
        <div class="file-upload">
          <div class="file-upload__form">
            <input v-on:change="uploadImage" type="file">
          </div>
          <div class="file-upload__preview" v-if="imageId">
            <img v-bind:src="imagePreviewUrl">
          </div>
        </div>
        <label>
          <span>Titel</span>
          <input type="text" v-model="entryTitle">
        </label>
        <label>
          <span>Beschreibung</span>
          <textarea v-model="entryText" rows="5"></textarea>
        </label>
        <span class="fametoggle-label">Guter Spot oder schlechter Spot?</span>
        <label class="fametoggle">
          <input type="checkbox" v-model="entryFamed" name="famed">
          <span class="slider">
            <span class="slider__button"></span>
          </span>
        </label>
        <button type="submit" class="btn" v-bind:class="{ disabled: !formReady }" :disabled="!formReady">Senden</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'add-view',
  props: ['propCoords'],
  data () {
    return {
      addressPending: false,

      entryAddress: '',
      entryCoords: null,
      entryTitle: '',
      entryText: '',
      entryFamed: true,
      imageId: null
    }
  },

  computed: {
    userCoords() {
      return this.$store.state.userCoords;
    },
    formReady() {
      return (this.entryAddress != '' && this.entryTitle != '' && this.entryText != '' && this.imageId != null);
    },
    imagePreviewUrl() {
      return 'https://backend.bikeable.ch/api/v1/photos/' + this.imageId + '?size=small';
    }
  },

  watch: {
  },

  mounted() {
    this.handleParamCoords();
  },

  methods: {
    handleParamCoords() {

      if(!this.$route.params.coords) return;

      let pCoords = this.$route.params.coords;
      this.addressPending = true;

      this.getAddress(pCoords.lat + ',' + pCoords.lng)
        .then((address) => {
          this.entryAddress = address;
          this.entryCoords = pCoords;
          this.addressPending = false;
        }, (data) => {
          this.$store.dispatch('handleError', 'Fehler');
          this.addressPending = false;
        });

    },
    handleUserCoords() {
      this.addressPending = true;

      this.getAddress(this.userCoords.lat + ',' + this.userCoords.lng)
        .then((address) => {
          this.entryAddress = address;
          this.entryCoords = this.userCoords;
          this.addressPending = false;
        }, (data) => {
          this.$store.dispatch('handleError', 'Fehler');
          this.addressPending = false;
        });
    },
    getAddress(coords) {

      return new Promise((resolve, reject) => {
        this.$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+coords+'&key=AIzaSyDSPhuEAL3Hv0zmbnhGQlTu9ax0uLXmuOE').then(response => {
          if(response.body.results[0].formatted_address != '') {
            let address = response.body.results[0].formatted_address;
            resolve(address);
          }else{
            reject(response);
          }
        }, response => {
          reject(esponse);
        });
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
            let msg = response.body.status + ': ' + response.body.message;
            this.$store.commit('SET_MESSAGE', msg);
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
          this.$store.dispatch('loadEntries');
          this.$router.push('/entries/' + data.body.data._id);
          console.log(data);
        }, (data) => {
          console.log('error', data);
          // this.message = data.body.message;
        });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.add {
  margin: 2rem 0;

  h1 {
    margin-bottom: 2rem;
  }
}


.file-upload {
  padding: 1rem;
  padding-bottom: 0;
  background-color: #fff;
  margin: 0 0 1rem 0;
  max-width: 700px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  height: 7rem;
  position: relative;

  span {
    background-color: $c-main;
    color: #fff;
    font-size: .75rem;
    color: #fff;
    padding: .5rem 1rem;
  }

  &__form {
    width: calc(100% - 6rem);

    input {
      margin: 0;
      font-size: 1rem;
      font-family: $f-body;
      width: 100%;
    }
  }

  &__preview {
    width: 6rem;
    height: calc(7rem - 4px);
    padding: 0;
    box-sizing: border-box;
    position: absolute;
    right: 0;
    top: 0;
    text-align: right;

    img {
      max-width: 100%;
      max-height: 100%;
      height: auto;
      width: auto;
    }
  }
}

.fametoggle-label {
  display: block;
  font-size: .8rem;
  margin-bottom: .3rem;
  color: #888;
}
.fametoggle {
  position: relative;
  display: block;
  margin: 1rem 0 2rem 0;
  width: 10.4rem;
  height: 5.4rem;

  input {
    display: none;

    &:checked + .slider {
      // background-color: #333;
    }
    &:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }
    &:checked + .slider .slider__button {
      transform: translateX(5rem) rotate(360deg);
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIxMzBweCIgaGVpZ2h0PSIxMzBweCIgdmlld0JveD0iMCAwIDEzMCAxMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgIDxkZWZzPjwvZGVmcz4gICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0ic21pbGUtZ29vZCI+ICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0iIzMzQkRDQSIgY3g9IjY1IiBjeT0iNjUiIHI9IjY1Ij48L2NpcmNsZT4gICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1LjAwMDAwMCwgMzMuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+ICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtMiIgY3g9IjQiIGN5PSI0IiByPSI0Ij48L2NpcmNsZT4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yLUNvcHkiIGN4PSIzNyIgY3k9IjQiIHI9IjQiPjwvY2lyY2xlPiAgICAgICAgICAgIDwvZz4gICAgICAgICAgICA8cGF0aCBkPSJNMzUuNzUsNTggQzM1Ljc1LDY4LjI1MTgzNjYgNDQuODQ3MjM5LDc2LjUgNTYsNzYuNSBDNjcuMTUyNzYxLDc2LjUgNzYuMjUsNjguMjUxODM2NiA3Ni4yNSw1OCBDNzYuMjUsNTcuMTcxNTcyOSA3NS41Nzg0MjcxLDU2LjUgNzQuNzUsNTYuNSBDNzMuOTIxNTcyOSw1Ni41IDczLjI1LDU3LjE3MTU3MjkgNzMuMjUsNTggQzczLjI1LDY2LjUyNTg0NDkgNjUuNTU3OTE3Miw3My41IDU2LDczLjUgQzQ2LjQ0MjA4MjgsNzMuNSAzOC43NSw2Ni41MjU4NDQ5IDM4Ljc1LDU4IEMzOC43NSw1Ny4xNzE1NzI5IDM4LjA3ODQyNzEsNTYuNSAzNy4yNSw1Ni41IEMzNi40MjE1NzI5LDU2LjUgMzUuNzUsNTcuMTcxNTcyOSAzNS43NSw1OCBaIiBpZD0iT3ZhbC0zIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==);
    }
  }

  .slider {
    display: block;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    box-shadow: 0 0 0 2px #ccc;
    // border: 2px solid #ccc;
    box-sizing: border-box;
    margin: 0;
    border-radius: 5.4rem;

    &__button {
      content: "";
      position: absolute;
      height: 5rem;
      width: 5rem;
      left: .2rem;
      top: .2rem;
      border-radius: 99%;
      background-color: transparent;
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIxMzBweCIgaGVpZ2h0PSIxMzBweCIgdmlld0JveD0iMCAwIDEzMCAxMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+c21pbGUtYmFkPC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+ICAgIDxkZWZzPjwvZGVmcz4gICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0ic21pbGUtYmFkIj4gICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBmaWxsPSIjRjkyNDkzIiBjeD0iNjUiIGN5PSI2NSIgcj0iNjUiPjwvY2lyY2xlPiAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTUuMDAwMDAwLCA1My4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yIiBjeD0iNCIgY3k9IjQiIHI9IjQiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTItQ29weSIgY3g9IjM3IiBjeT0iNCIgcj0iNCI+PC9jaXJjbGU+ICAgICAgICAgICAgPC9nPiAgICAgICAgICAgIDxwYXRoIGQ9Ik05Ni4zOTUyNjEzLDk0LjY0NTI5NDIgQzk2LjIxNjM0MjEsODQuMzk1MDE5IDg2Ljk3NjUzODMsNzYuMzA2ODgwNSA3NS44MjU0NzU5LDc2LjUwMTUyMyBDNjQuNjc0NDEzNiw3Ni42OTYxNjU2IDU1LjcyMjUxMDQsODUuMTAxODQxNCA1NS45MDE0Mjk2LDk1LjM1MjExNjYgQzU1LjkxNTg4NzcsOTYuMTgwNDE3NiA1Ni41OTkwNzg4LDk2Ljg0MDE2NzYgNTcuNDI3Mzc5OCw5Ni44MjU3MDk2IEM1OC4yNTU2ODA3LDk2LjgxMTI1MTUgNTguOTE1NDMwOCw5Ni4xMjgwNjA0IDU4LjkwMDk3MjcsOTUuMjk5NzU5NCBDNTguNzUyMTc2Miw4Ni43NzUyMTMxIDY2LjMyMTM3MTcsNzkuNjY3ODc0OCA3NS44Nzc4MzMyLDc5LjUwMTA2NjEgQzg1LjQzNDI5NDYsNzkuMzM0MjU3NSA5My4yNDY5MjE3LDg2LjE3MzEwNSA5My4zOTU3MTgyLDk0LjY5NzY1MTQgQzkzLjQxMDE3NjIsOTUuNTI1OTUyMyA5NC4wOTMzNjc0LDk2LjE4NTcwMjQgOTQuOTIxNjY4Myw5Ni4xNzEyNDQzIEM5NS43NDk5NjkzLDk2LjE1Njc4NjMgOTYuNDA5NzE5Myw5NS40NzM1OTUxIDk2LjM5NTI2MTMsOTQuNjQ1Mjk0MiBaIiBpZD0iT3ZhbC0zIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==);
      background-size: 100%;
      transition: .3s transform $easeOutQuint, .4s background-color $easeOutQuint;
    }
  }

}

.label-address {
  display: block;
  position: relative;
  max-width: 700px;
  box-sizing: border-box;
  padding-right: 4rem;
}
.userloc {
  display: block;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 3rem;
  height: 3rem;
  background: $c-main;
  background-image: url('../assets/locatebutton.png');
  background-size: 50%;
  background-position: center;
  background-repeat: no-repeat;

  &.disabled {
    pointer-events: none;
    background-color: #ccc;
  }
}

</style>
