<template>
  <div class="filter-bar">
      <label for="range">Zeit</label>
      <div>
          <c-date-range-picker id="range"
          :from="new Date()" :to="new Date()">
          </c-date-range-picker>
      </div>
      <label for="type">Type</label>
      <div class="selection-filter">
        <select id="type" @change="commitFilter" v-model="filter.type">
          <option value="null">Alle</option>
          <option value="fame">Fame</option>
          <option value="shame">Shame</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>
      <label for="hashtag">Hashtag</label>
      <div class="selection-filter">
        <select id="hashtag" @change="commitFilter" v-model="filter.hashtag">
          <option v-for="option in categories" v-bind:value="option._id"> {{ option.de }}</option>
        </select>
      </div>
  </div>
</template>
<script>

import DateRangePicker from '@/components/DateRangePicker'
import categories from '../api/categories';

export default {
  name: 'c-filter-bar',
  props: ['filters'],
  data () {
    return {
      filter: {type:null, hashtag:null},
      categories: []
    }
  },
  components: {
    'c-date-range-picker' : DateRangePicker
  },
  watch: {
  },
  computed: {
  },
  mounted() {
    this.getCategories();
    console.log(this.categories);
  },
  methods: {
    commitFilter() {
      this.$emit("change", this.filter);
    },
    getCategories() {
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
    }
  }
}

</script>

<style lang="scss">

@import '../styles/helpers';

.filter-bar {
  background-color: #fafafa;
  display: flex;
  padding: 4px;
  box-shadow: 0 4px 10px 0 rgba(#000, .1);
  font-size: .9rem;

  label {
      padding: 7px 15px 7px 15px;
      margin:0;
  }

  input {
    font-size: .9rem;
  }

  .selection-filter {
    overflow: hidden;
    padding-left: 20px;
    position: relative;
    display: flex;

  &::before {
    content: "";
    display: block;
    padding: 3px;
    position: absolute;
    top: 12px;
    left: 5px;
    border: solid $c-black;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    transform-origin: 50% 50%;
  }

    select {
      font-size: .9rem;
      color: $c-black;
      padding: 7px;
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

}
</style>
  