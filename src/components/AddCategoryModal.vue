<template :key=availableCats>
  <transition name="modal">
    <div class="add-category-modal" @click="$emit('close')">
      <div class="add-category-modal__inner" @click.stop>
        <form @submit.prevent="postCategory">
          <h3>{{ $t("entry.addcat") }}</h3>
          <div>
          <select
            class="input-select cat-input"
            v-model="selectedCatId"
          >
            <option :value="null" selected>{{ $t("addform.choosecat") }}</option>
            <option :value="cat._id" v-for="cat in availableCats" :key="cat._id">
              {{ cat[locale] }}
            </option>
            </select>
          </div>
            <button
              type="submit"
              class="btn"
              v-bind:class="{ disabled: selectedCatId == null }"
            >
              {{ $t("entry.addcat") }}
            </button>
        </form>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "c-add-category-modal",
  props: ["entryId", "entry"],
  data() {
    return {
      selectedCatId: null
    };
  },
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
    availableCats() {
      if(this.entry.categories) {
        var filteredCategories = this.categories;
        for(var i=0; i < this.entry.categories.length; i++) {
          filteredCategories = filteredCategories.filter((c) => {
            return c._id != this.entry.categories[i]["_id"]
          });
        }

        return filteredCategories;
      } else {
        return this.categories;
      }
    },
    locale() {
      return this.$i18n.locale;
    },
  },
  watch: {},
  mounted() {

  },

  methods: {
    postCategory(e) {
      if (this.selectedCatId == null) return;

      this.$store
        .dispatch("addCategory", {
          spotId: this.entryId,
          categoryId: this.selectedCatId
        })
        .then((data) => {
          this.$emit("close");
          this.$emit("success");
        });
    },

  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.add-category-modal {
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

.cat-input {
    border-color: $c-grey-darkest;
    cursor: pointer;

  }

  ul.selected-cats {
    margin-top: 1rem;

    li {
      display: inline-block;
      padding: 0.5rem .5rem .5rem 1rem;
      border-radius: 4px;
      background: $c-blue;
      margin-right: 0.5rem;

      div {
        --webkit-appearance: none;
        border: none;
        font-family: $f-body;
        font-size: 0.8rem;
        line-height: 1.5rem;
        text-align: center;
        padding: 0;
        background: #fff;
        margin-left: 0.5rem;
        border-radius: 99%;
        width: 1.5rem;
        height: 1.5rem;
        cursor: pointer;
      }
    }
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

  .add-category-modal__inner {
    transition: 0.4s transform ease-out;
  }
}
.modal-enter,
.modal-leave-to {
  opacity: 0;

  .add-category-modal__inner {
    transform: translateY(40px);
  }
}
</style>
