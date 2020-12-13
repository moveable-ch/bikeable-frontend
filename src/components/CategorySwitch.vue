<template>
  <div>
    <label for="type">{{ $t('filterbar.category') }}</label>
    <div class="categoryswitch">
      <select v-model="currentCategory">
        <option value="">{{ $t('filterbar.allcategories') }}</option>
        <option v-for="category in categories" v-bind:value="category._id" v-bind:key="category._id">{{ category[$i18n.locale] }}</option>
      </select>
    </div>
  </div>
</template>

<script>
import categories from '../api/categories';

export default {
  name: 'category-switch',
  props: [],
  data () {
    return {
      currentCategory: '',
      categories: [],
      switcherVisible: false
    }
  },
  computed: {
    selectedCategory() {
      return this.$store.getters.selectedCategory;
    }
  },
  watch: {
    currentCategory(to, from) {
      this.setCategory(to);
    },
    selectedCategory(to, from) {
      this.currentCategory = this.selectedCategory;
    }
  },
  mounted() {
    this.loadCategories();
    this.currentCategory = this.selectedCategory;
  },
  methods: {
    loadCategories() {
      this.$store.commit('LOAD_START');

      categories.getCategories()
        .then((result) => {
          this.$store.commit('LOAD_FINISH');
          this.categories = result;
        },
        (error) => {
          this.$store.commit('LOAD_FINISH');
          this.$store.dispatch('handleError', 'Fehler');
        });
    },
    setCategory(category) {
      this.switcherVisible = false;

      this.$store.dispatch('setSelectedCategory', category)
      .then((data) => {
        this.category
        }, (data) => {
          this.$store.dispatch('handleError', 'Error');
        });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.categoryswitch {
  max-width: 100%;
  padding-left: 20px;
  position: relative;
  display: flex;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 1px 2px 0 rgba(#000, 0.05);
  box-sizing: border-box;
  border-radius: 4px;
  margin: 0 1rem 0 0;

  &::before {
    content: "";
    display: block;
    padding: 3px;
    position: absolute;
    top: 50%;
    left: 10px;
    border: solid $c-black;
    border-width: 0 2px 2px 0;
    transform: translateY(-50%) rotate(45deg);
    transform-origin: 50% 50%;
  }

  select {
      font-size: 1rem;
      line-height: 1.1;
      color: $c-black;
      padding: 0.5rem;
      border: none;
      border-radius: 0;
      box-shadow: none;
      background: transparent;
      background-image: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;

      &::-ms-expand {
        display: none;
      }

      &:focus {
        outline: none;
      }

      &:hover {
        text-decoration: underline;
      }

  }
}

</style>
