<!-- /add -->

<!-- <i18n>

{
  "en": {
    "addspot": "Create Spot"
  },
  "de": {
    "addspot": "Spot erstellen"
  },
  "fr": {
    "addspot": "Créer un spot"
  }
}
</i18n> -->

<template>
  <div class="add">
    <map-modal-view
      v-if="showMapModal"
      @close="showMapModal = false"
      @setCoords="handleMapCoords"
      :propCoords="entryCoords">
    </map-modal-view>
    <div class="container">
      <h1>{{ $t('addform.addspot') }}</h1>
      <form @submit.prevent="postEntry">
        <h3><span class="num">1</span>{{ $t('addform.photo') }}</h3>
        <span class="label">{{ $t('addform.uploadimage') }}</span>
        <div class="file-upload">
          <div class="file-upload__form" v-if="!imageChosen">
            <label for="add-file">{{ $t('addform.chooseimage')}}</label>
            <input id="add-file" @change.prevent="uploadImage" type="file">
          </div>
          <span class="file-upload__pending" v-if="!imageId && imageChosen">{{ $t('addform.loading') }}</span>
          <div class="file-upload__preview" v-if="imageId">
            <a href="#" class="file-upload__preview__close" @click.prevent="resetImage">×</a>
            <img v-bind:src="imagePreviewUrl" @error="imageLoadError">
          </div>
        </div>
        <div class="fameorshame">
          <h3><span class="num">2</span>Fame or Shame?</h3>
          <div class="checkboxes">
            <input id="fame" type="radio" name="fameorshame" value="famed" v-model="entryFamed">
            <label for="fame" class="fameradio-label radio-label">
              <span>Fame</span>
            </label>
            <input id="shame" type="radio" name="fameorshame" value="shamed" v-model="entryFamed">
            <label for="shame" class="shameradio-label radio-label">
              <span>Shame</span>
            </label>
          </div>
        </div>
        <h3><span class="num">3</span>{{ $t('addform.adress') }}</h3>
        <label>
          <span>{{ $t('addform.spotwhere') }}</span>
          <input placeholder="Adresse eingeben" type="text" v-model="entryAddress" v-bind:class="{ inactive: addressPending }" v-on:blur="checkAddress">
        </label>
        <div class="address-btns">
          <a href="#" class="address-btn address-btn--userloc" v-bind:class="{ disabled: !userCoords }" @click.prevent="handleUserCoords">{{ $t('addform.entercurrentposition') }}</a>
          <a href="#" class="address-btn address-btn--map" @click.prevent="showMapModal = true">{{ $t('addform.chooselocation') }}</a>
        </div>
        <h3><span class="num">4</span>{{ $t('addform.description') }}</h3>
        <label>
          <span>Titel</span>
          <input type="text" v-model="entryTitle">
        </label>
        <label>
          <span>{{ $t('addform.description') }}</span>
          <textarea v-model="entryText" rows="5"></textarea>
        </label>
        <button type="submit" class="add__btn btn" v-bind:class="{ disabled: !formReady }" :disabled="!formReady">{{ $t('addform.send') }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AddMapModal from '@/components/AddMapModal';

export default {
  name: 'v-add-form',
  props: ['propCoords'],
  components: {
    'map-modal-view': AddMapModal
  },
  data () {
    return {
      showMapModal: false,
      addressPending: false,

      entryAddress: '',
      entryCoords: null,
      entryTitle: '',
      entryText: '',
      entryFamed: null,
      imageId: null,
      imageChosen: false
    }
  },

  computed: {
    userCoords() {
      return this.$store.getters.userCoords;
    },
    formReady() {
      return (this.entryAddress != '' && this.entryTitle != '' && this.entryText != '' && this.imageId != null && this.entryFamed != null);
    },
    imagePreviewUrl() {
      return process.env.BACKEND_URL + '/api/v1/photos/' + this.imageId + '?size=small';
    }
  },

  watch: {
  },

  mounted() {
    this.handleParamCoords();
  },

  methods: {
    imageLoadError() {
      console.log('image load error');
    },

    handleMapCoords(coords) {

      if(!coords) return;

      this.addressPending = true;

      this.getAddress(coords.lat + ',' + coords.lng)
        .then((address) => {
          this.entryAddress = address;
          this.entryCoords = coords;
          this.addressPending = false;
        }, (data) => {
          this.$store.dispatch('handleError', 'Fehler');
          this.addressPending = false;
        });

    },

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
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+coords+'&key=AIzaSyDSPhuEAL3Hv0zmbnhGQlTu9ax0uLXmuOE').then(response => {
          if(response.data.results[0].formatted_address != '') {
            let address = response.data.results[0].formatted_address;
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

      axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.entryAddress + '&key=AIzaSyDSPhuEAL3Hv0zmbnhGQlTu9ax0uLXmuOE')
      .then(response => {
        if(response.data.results[0]) {
          this.entryAddress = response.data.results[0].formatted_address;
          this.entryCoords = response.data.results[0].geometry.location;
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
      this.imageChosen = true;

      let imageFile = e.currentTarget;
      let file = imageFile.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (fileLoadEvent) => {
        this.$store.dispatch('uploadImage', {
          data: reader.result
        })
        .then((data) => {
            this.imageId = data.imageId;
          }, (data) => {
            this.$store.dispatch('handleError', 'Error');
          });
      };
    },
    resetImage() {
      this.imageChosen = false;
      this.imageId = null;
    },
    postEntry(e) {
      if(!this.formReady) return;

      this.$store.dispatch('addSpot', {
          title: this.entryTitle,
          text: this.entryText,
          imageId: this.imageId,
          address: this.entryAddress,
          coords: this.entryCoords,
          famed: this.entryFamed == "famed"
        })
      .then((data) => {
          this.$router.push('/entries/' + data._id);
        });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.add {
  margin: 0;
  padding-top: 5rem;

  @include tablet {
    padding-top: 6rem;
  }

  &::before, &::after {
    content: "";
    display: block;
    width: 100%;
    height: 30rem;
    position: absolute;
    top: 0;
    left: 0;
  }
  &::before {
    z-index: -1;
    background-image: linear-gradient(0deg, #FFFFFF 2%, rgba(255,255,255,0.00) 74%);
  }
  &::after {
    z-index: -2;
    background-image: linear-gradient(-137deg, #FCFFD6 0%, #E2FDFF 100%);
  }

  h1 {
    // margin-top: 3rem;
    // margin-bottom: 4rem;
  }
  h3 {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    margin-top: 2rem;

    .num {
      display: inline-block;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      font-weight: bold;
      background-color: #fafafa;
      border: 1px solid #eee;
      text-align: center;
      margin-right: 1rem;
      border-radius: 99%;
    }

    @include tablet() {
      margin-top: 3.5rem;
      margin-bottom: 2rem;
    }
  }
  &__btn {
    display: block;
    height: 3rem;
    width: 100%;
    margin: 2rem auto 4rem auto;
    box-sizing: border-box;

    @include tablet() {
      width: 15rem;
      margin: 3rem 0 4rem 0;
    }
  }
}


.file-upload {

  &__form {

    label {
      display: block;
      color: #666;
      border: 1px solid #666;
      // border-radius: 4px;
      width: 14rem;
      text-align: center;
      font-weight: 500;
      height: 3rem;
      line-height: 3rem;
      cursor: pointer;
      margin-top: 1rem;
      background-color: #fafafa;
      font-size: 1rem;

      &:hover {
        border-color: $c-main;
        color: $c-main;
      }
    }
    input {
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      position: absolute;
      z-index: -1;
    }
  }

  &__pending {
    display: block;
    color: #aaa;
    width: 14rem;
    text-align: center;
    line-height: 3rem;
    height: 3rem;
    margin-top: 1rem;
    background-color: #fafafa;
    // border-radius: 4px;
  }

  &__preview {
    width: 15rem;
    height: 10rem;
    background-color: #fafafa;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &__close {
      color: #333;
      text-decoration: none;
      position: absolute;
      top: 0;
      right: -1.5rem;
      font-size: 2rem;
      color: #aaa;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      height: auto;
      width: auto;
    }
  }
}

.fameorshame {

  .checkboxes {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  input+label {
    opacity: .4;
    transform: scale(.9);
  }

  input:checked+label {
    opacity: 1.0;
    transform: scale(1.1);
  }

  input:hover+label {
    opacity: 1;
  }

  label {
    cursor: pointer;
    transition: opacity .4s $easeOutQuint, transform .4s $easeOutQuint;
    opacity: .2;
    position: relative;
    display: block;
    font-size: .8rem;
    margin: 1rem 0 1rem 0;
    width: 5.4rem;
    height: 7rem;
    background-size: 5.4rem 5.4rem;
    background-repeat: no-repeat;

    span {
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: 0;
    }

  }
}

.fameradio-label {
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIxMzBweCIgaGVpZ2h0PSIxMzBweCIgdmlld0JveD0iMCAwIDEzMCAxMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgIDxkZWZzPjwvZGVmcz4gICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0ic21pbGUtZ29vZCI+ICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgZmlsbD0iIzMzQkRDQSIgY3g9IjY1IiBjeT0iNjUiIHI9IjY1Ij48L2NpcmNsZT4gICAgICAgICAgICA8ZyBpZD0iR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM1LjAwMDAwMCwgMzMuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+ICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtMiIgY3g9IjQiIGN5PSI0IiByPSI0Ij48L2NpcmNsZT4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yLUNvcHkiIGN4PSIzNyIgY3k9IjQiIHI9IjQiPjwvY2lyY2xlPiAgICAgICAgICAgIDwvZz4gICAgICAgICAgICA8cGF0aCBkPSJNMzUuNzUsNTggQzM1Ljc1LDY4LjI1MTgzNjYgNDQuODQ3MjM5LDc2LjUgNTYsNzYuNSBDNjcuMTUyNzYxLDc2LjUgNzYuMjUsNjguMjUxODM2NiA3Ni4yNSw1OCBDNzYuMjUsNTcuMTcxNTcyOSA3NS41Nzg0MjcxLDU2LjUgNzQuNzUsNTYuNSBDNzMuOTIxNTcyOSw1Ni41IDczLjI1LDU3LjE3MTU3MjkgNzMuMjUsNTggQzczLjI1LDY2LjUyNTg0NDkgNjUuNTU3OTE3Miw3My41IDU2LDczLjUgQzQ2LjQ0MjA4MjgsNzMuNSAzOC43NSw2Ni41MjU4NDQ5IDM4Ljc1LDU4IEMzOC43NSw1Ny4xNzE1NzI5IDM4LjA3ODQyNzEsNTYuNSAzNy4yNSw1Ni41IEMzNi40MjE1NzI5LDU2LjUgMzUuNzUsNTcuMTcxNTcyOSAzNS43NSw1OCBaIiBpZD0iT3ZhbC0zIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==);
}

.shameradio-label {
  background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHdpZHRoPSIxMzBweCIgaGVpZ2h0PSIxMzBweCIgdmlld0JveD0iMCAwIDEzMCAxMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+ICAgICAgICA8dGl0bGU+c21pbGUtYmFkPC90aXRsZT4gICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+ICAgIDxkZWZzPjwvZGVmcz4gICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+ICAgICAgICA8ZyBpZD0ic21pbGUtYmFkIj4gICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsIiBmaWxsPSIjRjkyNDkzIiBjeD0iNjUiIGN5PSI2NSIgcj0iNjUiPjwvY2lyY2xlPiAgICAgICAgICAgIDxnIGlkPSJHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTUuMDAwMDAwLCA1My4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4gICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC0yIiBjeD0iNCIgY3k9IjQiIHI9IjQiPjwvY2lyY2xlPiAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLTItQ29weSIgY3g9IjM3IiBjeT0iNCIgcj0iNCI+PC9jaXJjbGU+ICAgICAgICAgICAgPC9nPiAgICAgICAgICAgIDxwYXRoIGQ9Ik05Ni4zOTUyNjEzLDk0LjY0NTI5NDIgQzk2LjIxNjM0MjEsODQuMzk1MDE5IDg2Ljk3NjUzODMsNzYuMzA2ODgwNSA3NS44MjU0NzU5LDc2LjUwMTUyMyBDNjQuNjc0NDEzNiw3Ni42OTYxNjU2IDU1LjcyMjUxMDQsODUuMTAxODQxNCA1NS45MDE0Mjk2LDk1LjM1MjExNjYgQzU1LjkxNTg4NzcsOTYuMTgwNDE3NiA1Ni41OTkwNzg4LDk2Ljg0MDE2NzYgNTcuNDI3Mzc5OCw5Ni44MjU3MDk2IEM1OC4yNTU2ODA3LDk2LjgxMTI1MTUgNTguOTE1NDMwOCw5Ni4xMjgwNjA0IDU4LjkwMDk3MjcsOTUuMjk5NzU5NCBDNTguNzUyMTc2Miw4Ni43NzUyMTMxIDY2LjMyMTM3MTcsNzkuNjY3ODc0OCA3NS44Nzc4MzMyLDc5LjUwMTA2NjEgQzg1LjQzNDI5NDYsNzkuMzM0MjU3NSA5My4yNDY5MjE3LDg2LjE3MzEwNSA5My4zOTU3MTgyLDk0LjY5NzY1MTQgQzkzLjQxMDE3NjIsOTUuNTI1OTUyMyA5NC4wOTMzNjc0LDk2LjE4NTcwMjQgOTQuOTIxNjY4Myw5Ni4xNzEyNDQzIEM5NS43NDk5NjkzLDk2LjE1Njc4NjMgOTYuNDA5NzE5Myw5NS40NzM1OTUxIDk2LjM5NTI2MTMsOTQuNjQ1Mjk0MiBaIiBpZD0iT3ZhbC0zIiBmaWxsPSIjRkZGRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iPjwvcGF0aD4gICAgICAgIDwvZz4gICAgPC9nPjwvc3ZnPg==);
}


.address-btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 700px;
}
.address-btn {
  display: block;
  height: 2.5rem;
  font-size: .8rem;
  background-color: #fafafa;
  border: 1px solid #eee;
  padding: 0 1rem 0 3.5rem;
  color: #333;
  box-sizing: border-box;
  text-decoration: none;
  line-height: 2.5rem;
  position: relative;
  width: 100%;
  margin-bottom: 5px;
  white-space: nowrap;
  // border-radius: 4px;
  overflow: hidden;

  @include tablet() {
    width: calc(50% - 3px);
  }

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 2.5rem;
    height: 2.5rem;
    background-color: #333;
    background-size: 1.5rem 1.5rem;
    background-position: center;
    background-repeat: no-repeat;
  }
  &.disabled {
    pointer-events: none;
    color: #aaa;
    background-color: transparent;

    &::before {
      background-color: #ccc;
    }
  }
  &:hover {
    color: $c-main;
    border-color: $c-main;

    &::before {
      background-color: $c-main;
    }
  }

  &--userloc {
    &::before {
      background-image: url('../assets/locatebutton.png');
    }
  }
  &--map {
    &::before {
      background-image: url('../assets/mapbutton.png');
    }
  }
}

</style>
