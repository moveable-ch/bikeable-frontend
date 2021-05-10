<template>
  <transition name="modal">
    <div class="add-photo-modal" @click="$emit('close')">
      <div class="add-photo-modal__inner" @click.stop>
        <form @submit.prevent="postImage">
          <h3>{{ $t("entry.addphototitle") }}</h3>
          <span class="label">{{ $t("entry.addphotodesc") }}</span>

          <div class="file-upload">
            <div class="file-upload__form" v-if="!uploading && !imageId">
              <label for="add-file">{{ $t("addform.chooseimage") }}</label>
              <input id="add-file" @change.prevent="uploadImage" type="file" />
            </div>

            <span class="file-upload__pending" v-if="uploading">{{
              $t("addform.loading")
            }}</span>

            <div class="file-upload__preview" v-if="imageId">
              <a
                href="#"
                class="file-upload__preview__close"
                @click.prevent="resetImage(imageId)"
                >×</a
              >
              <img v-bind:src="imagePreviewUrl(imageId)" />
            </div>

            <div class="file-upload__checkbox" v-if="!entry.famed">
              <label
                ><input type="checkbox" v-model="showsFix" />
                {{ $t("entry.addphotofix") }}</label
              >
            </div>

            <button
              type="submit"
              class="btn"
              v-bind:class="{ disabled: !imageId }"
            >
              {{ $t("entry.send") }}
            </button>
          </div>
        </form>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>
    </div>
  </transition>
</template>

<script>
import Compressor from "compressorjs";

export default {
  name: "c-add-photo-modal",
  props: ["entryId", "entry"],
  data() {
    return {
      uploading: false,
      imageId: null,
      showsFix: false,
    };
  },
  computed: {},
  watch: {},
  mounted() {},

  methods: {
    imagePreviewUrl(imageId) {
      return (
        process.env.VUE_APP_BACKEND_URL +
        "/api/v1/photos/" +
        imageId +
        "?size=small"
      );
    },
    uploadImage(e) {
      this.uploading = true;

      let imageFile = e.currentTarget;
      let file = imageFile.files[0];

      new Compressor(file, {
        quality: 0.6,
        maxWidth: 900,
        maxHeight: 900,
        success: (result) => {
          let reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onload = (fileLoadEvent) => {
            this.$store
              .dispatch("uploadImage", {
                data: reader.result,
              })
              .then(
                (data) => {
                  this.uploading = false;
                  this.imageId = data.imageId;
                },
                (data) => {
                  this.$store.dispatch("handleError", "Error");
                  this.uploading = false;
                }
              );
          };
        },
        error(err) {
          console.log(err.message);
        },
      });
    },
    resetImage() {
      this.imageId = null;
    },
    postImage(e) {
      if (!this.imageId) return;

      if (this.entryId) {
        this.$store
          .dispatch("addPhoto", {
            data: { imageId: this.imageId, showsFix: this.showsFix },
            spotId: this.entryId,
          })
          .then((data) => {
            this.$emit("close");
            this.$emit("success");
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/helpers";

.add-photo-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;

  .file-upload__pending {
    display: block;
    margin: 1rem 0;
    background: $c-blue;
    padding: 0.5rem;
    text-align: center;
    border-radius: 4px;
  }
  .file-upload__preview {
    width: 13rem;
    height: 8rem;
    background-color: $c-blue;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 1rem 0;

    &__close {
      font-family: Arial, "sans-serif";
      color: $c-black;
      text-decoration: none;
      position: absolute;
      top: 50%;
      right: 50%;
      width: 50px;
      height: 50px;
      margin-right: -25px;
      margin-top: -25px;
      border-radius: 99%;
      background-color: rgba(#fff, 0.4);
      text-align: center;
      font-size: 2rem;
      line-height: 50px;

      &:hover {
        background-color: rgba(#fff, 0.6);
      }
    }
    img {
      max-width: 100%;
      max-height: 100%;
      height: auto;
      width: auto;
    }
  }
  .file-upload__form {
    label {
      border: 2px dashed $c-black;
      border-radius: 4px;
      padding: 0.5rem;
      margin-top: 1rem;
      background-color: $c-blue;
      text-align: center;
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

  .file-upload__checkbox {
    font-size: 0.9rem;
    margin-top: 1.5rem;
  }

  &__content {
    overflow: hidden;
    width: calc(100% - 5rem);
    padding: 0.5rem 1rem;
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
    max-width: 30rem;
    max-height: 20rem;
    position: relative;
    border-radius: 4px;
    box-shadow: 0 6px 6px -4px rgba(#000, 0.3);
    border: 1px solid $c-grey;
    padding: 2rem;

    .btn-close {
      font-size: 1.5rem;
      font-weight: 600;
      padding: 0;
      background: none;
      border: none;
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: $c-black;
      color: #fff;
      width: 3rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      z-index: 0;
      cursor: pointer;
      border-radius: 99%;
      box-shadow: 0 6px 6px -4px rgba(#000, 0.3);

      &:active,
      &:focus {
        outline: none;
        color: $c-main;
      }
      &:hover {
        color: $c-main;
      }
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: 0.4s opacity;

  .add-photo-modal__inner {
    transition: 0.4s transform ease-out;
  }
}
.modal-enter,
.modal-leave-to {
  opacity: 0;

  .add-photo-modal__inner {
    transform: translateY(40px);
  }
}
</style>
