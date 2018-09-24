<template>
  <transition name="modal">
    <div class="add-photo-modal">
      <div class="add-photo-modal__inner">

        <form @submit.prevent="postImage">
          <h3><span class="num">1</span>{{ $t('addform.photo') }}</h3>
          <span class="label">{{ $t('addform.uploadimage') }}</span>


        <div class="file-upload">

          <div class="file-upload__form" v-if="!uploading && !imageId">
            <label for="add-file">{{ $t('addform.chooseimage')}}</label>
            <input id="add-file" @change.prevent="uploadImage" type="file">
          </div>
         
          <span class="file-upload__pending" v-if="uploading">{{ $t('addform.loading') }}</span>

          <div class="file-upload__preview" v-if="imageId">
            <a href="#" class="file-upload__preview__close" @click.prevent="resetImage(imageId)">×</a>
            <img v-bind:src="imagePreviewUrl(imageId)">
          </div>

          <button type="submit" class="btn comments__form__button" v-bind:class="{ 'disabled': !imageId }">{{ $t('entry.send') }}</button>

        </div>

        </form>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'c-add-photo-modal',
  props: ['entryId'],
  data () {
    return {
      uploading: false,
      imageId: null
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {

  },

  methods: {
    imagePreviewUrl(imageId) {
      return process.env.BACKEND_URL + '/api/v1/photos/' + imageId + '?size=small';
    },
    uploadImage(e) {
      this.uploading = true;

      let imageFile = e.currentTarget;
      let file = imageFile.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (fileLoadEvent) => {
        this.$store.dispatch('uploadImage', {
          data: reader.result
        })
        .then((data) => {
            this.uploading = false;
            this.imageId = data.imageId;
          }, (data) => {
            this.$store.dispatch('handleError', 'Error');
            this.uploading = false;
          });
      };
    },
    resetImage() {
      this.imageId = null;
    },
    postImage(e) {
      if(!this.imageId) return;

      if(this.entryId) {

        this.$store.dispatch('addPhoto',
          {data: {imageId: this.imageId,
           showsFix: true
         }, spotId: this.entryId} )
        .then((data) => {
            this.$emit('close');
            // TODO: Reload spot-Gallery!
          });

      }
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.add-photo-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;

  &__content {
    overflow: hidden;
    width: calc(100% - 5rem);
    padding: .5rem 1rem;
  }
  &__map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &__inner {
    background-color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 1rem;
    width: 90%;
    height: 90%;
    max-width: 50rem;
    max-height: 40rem;
    position: relative;
    border-radius: 6px;
    box-shadow: 0 6px 6px -4px rgba(#000, .3);
    border: 1px solid $c-grey;

    .btn-close {
      font-size: 1.5rem;
      font-weight: 600;
      padding: 0;
      background: none;
      border: none;
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: #fff;
      width: 3rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      z-index: 0;
      cursor: pointer;
      border-radius: 99%;
      box-shadow: 0 6px 6px -4px rgba(#000, .3);

      &:active, &:focus {
        outline: none;
        color: $c-main;
      }
      &:hover {
        color: $c-main;
      }
    }
  }
}

.modal-enter-active, .modal-leave-active {
  transition: .4s opacity;

  .add-photo-modal__inner {
    transition: .4s transform $easeOutQuint;
  }
}
.modal-enter, .modal-leave-to {
  opacity: 0;

  .add-photo-modal__inner {
    transform: scale(.8);
  }
}

</style>
