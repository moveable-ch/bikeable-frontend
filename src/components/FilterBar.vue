<template>
  <div class="filter-bar" :class="{ 'showmobile': showMobile }">
    <div class="filter-bar__item">
      <label for="range">Zeit</label>
      <div>
        <c-date-range-picker
          id="range"
          :from="new Date()"
          :to="new Date()"
          :locale-data="{ format: 'dd.mm.yyyy' }"
          @change="commitFilter"
        ></c-date-range-picker>
      </div>
    </div>
    <div class="filter-bar__item">
      <label for="type">Type</label>
      <div class="selection-filter">
        <select id="type" @change="commitFilter" v-model="filter.type">
          <option value="null">Alle</option>
          <option value="fame">Fame</option>
          <option value="shame">Shame</option>
          <!--<option value="fixed">Fixed</option>-->
        </select>
      </div>
    </div>
    <div class="filter-bar__item">
      <label for="hashtag">Hashtag</label>
      <div class="selection-filter">
        <select id="hashtag" @change="commitFilter" v-model="filter.categoryId">
          <option value="null">{{ $t('filterbar.allcategories') }}</option>
          <option
            v-for="option in categories"
            :key="option._id"
            v-bind:value="option._id"
          >{{ option.de }}</option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
import DateRangePicker from "@/components/DateRangePicker";

export default {
  name: "c-filter-bar",
  props: ["filters", "showMobile"],
  data() {
    return {
      filter: { type: null, categoryId: null }
    };
  },
  components: {
    "c-date-range-picker": DateRangePicker
  },
  watch: {},
  computed: {
    categories() {
      return this.$store.getters.categories;
    }
  },
  mounted() {},
  methods: {
    commitFilter() {
      this.$store.dispatch("getLightSpots", this.filter);
    }
  }
};
</script>

<style lang="scss">
@import "../styles/helpers";

.filter-bar {
  background-color: #fafafa;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px 0 rgba(#000, 0.1);
  font-size: 0.9rem;
  height: auto;
  padding: 1rem;
  display: none;

  &.showmobile {
    display: flex;
  }

  @include tablet() {
    display: flex;
    flex-wrap: nowrap;
    height: 4rem;
    padding: 0 1rem;
  }

  &__item {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: 0.5rem 0;

    @include tablet() {
      width: auto;
      margin: 0;
    }
  }

  label {
    display: block;
    width: 100%;
    font-size: 0.75rem;
    padding-bottom: 4px;
    font-weight: bold;
    margin: 0;
  }

  input {
    font-size: 0.9rem;
  }

  .selection-filter {
    overflow: hidden;
    padding-left: 20px;
    position: relative;
    display: flex;
    background-color: #fff;
    border: 1px solid #eee;
    box-shadow: 0 1px 2px 0 rgba(#000, 0.05);
    box-sizing: border-box;
    border-radius: 4px;

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
}
</style>
  