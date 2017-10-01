<!-- /profile -->

<template>
  <div class="v-profile">
    <div class="container">
      <h1>Profil</h1>
      <form @submit.prevent="submitForm">
        <label>
          <span>Username</span>
          <input type="text" v-model="formUsername">
        </label>
        <label>
          <span>E-Mail</span>
          <input type="text" v-model="formEmail" disabled>
        </label>
        <span class="label">Avatar</span>
        <div class="v-profile__avatar" v-if="userAvatar">
          <img :src="userAvatar" @error="imageLoadError">
        </div>
        <div class="file-upload">
          <div class="file-upload__form">
            <label for="add-file">Neuen Avatar hochladen</label>
            <input id="add-file" @change.prevent="uploadImage" type="file">
          </div>
          <span class="file-upload__pending" v-if="!imageId && imageChosen">Loading</span>
        </div>
        <button class="input-button btn v-profile__submit" type="submit">Speichern</button>
        <div class="notice" v-if="message != ''">{{ message }}</div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'v-user-profile',
  data () {
    return {
      formEmail: '',
      formUsername: '',
      imageId: null,
      imageChosen: false,
      message: ''
    }
  },

  computed: {
    userData() {
      return this.$store.getters.userData;
    },
    userAvatar() {
      if(!this.userData.profile) return null;
      if(!this.userData.profile.avatar) return null;
      if(this.imageId) {
        return this.imagePreviewUrl;
      }
      return this.userData.profile.avatar.small;
    },
    imagePreviewUrl() {
      return 'https://backend.bikeable.ch/api/v1/photos/' + this.imageId + '?size=small';
    }
  },

  watch: {
    'userData': function() {
      this.fillForm();
    }
  },

  mounted() {
    this.fillForm();
  },

  methods: {
    fillForm() {
      if(!this.userData || !this.userData.email) return;
      this.formEmail = this.userData.email.address;
      this.formUsername = this.userData.username;
    },
    submitForm() {
      this.$store.dispatch('updateUser', {
          email: null,
          // email: this.formEmail,
          username: this.formUsername,
          avatar: this.imageId
        })
      .then((data) => {
        this.$store.dispatch('getUserData');
        this.$store.dispatch('handleError', 'Profil gespeichert');
      });
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
    imageLoadError() {
      console.log('image load error');
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.v-profile {
  padding-top: 0;
  padding-bottom: 4rem;

  @include desktop() {
    padding-top: 2rem;
  }

  &__submit {
    margin-top: 2rem;
  }
  .verified {
    margin-left: .5rem;
    font-size: .7rem;
    color: #ccc;
  }
  &__avatar {
    border: 1px solid #ccc;
    width: 10rem;
    height: 10rem;

    img {
      max-width: 100%;
      max-height: 100%;
      height: auto;
      width: auto;
    }
  }
  .file-upload .file-upload__form {
    label {
      font-size: .75rem;
      height: 2rem;
      line-height: 2rem;
      width: 11rem;
      border: 2px solid $c-main;
      background-color: transparent;
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


</style>
