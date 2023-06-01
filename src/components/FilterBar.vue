<template>
  <div class="filter-bar" :class="{ showmobile: showMobile }">
    <div class="filter-bar__item">
      <label for="range">{{ $t("filterbar.time") }}</label>
      <div>
        <c-date-range-picker
          id="range"
          :from="new Date()"
          :to="new Date()"
          v-model="datePickerData"
          @input="handleDateChange"
        ></c-date-range-picker>
      </div>
    </div>
    <div class="filter-bar__item">
      <label for="type">{{ $t("filterbar.type") }}</label>
      <div class="selection-filter">
        <select id="type" @change="commitFilter" v-model="filter.type">
          <option value="null">{{ $t("filterbar.alltypes") }}</option>
          <option value="fame">Fame</option>
          <option value="shame">Shame</option>
          <option value="fixed">Fixed</option>
        </select>
      </div>
    </div>
    <div class="filter-bar__item">
      <label for="hashtag">{{ $t("filterbar.category") }}</label>
      <div class="selection-filter">
        <select id="hashtag" @change="commitFilter" v-model="filter.categoryId">
          <option :value="null">{{ $t("filterbar.allcategories") }}</option>
          <option
            v-for="option in categories"
            :key="option._id"
            v-bind:value="option._id"
          >
            {{ option[$i18n.locale] }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
import DateRangePicker from "@/components/DateRangePicker";
import { format, parse } from "date-fns";

export default {
  name: "c-filter-bar",
  props: ["filters", "showMobile"],
  data() {
    return {
      datePickerData: {},
      filter: { type: null, categoryId: null, dateRange: null },
    };
  },
  components: {
    "c-date-range-picker": DateRangePicker,
  },
  watch: {},
  computed: {
    categories() {
      return this.$store.getters.categories;
    },
  },
  mounted() {},
  methods: {
    handleDateChange() {
      if (!this.datePickerData.dateRange) {
        this.filter.dateRange = null;
        this.commitFilter();
        return;
      }
      if (
        this.datePickerData.dateRange.start == null ||
        this.datePickerData.dateRange.end == null
      ) {
        return;
      }
      var startDate = format(this.datePickerData.dateRange.start, "T");
      var endDate = format(this.datePickerData.dateRange.end, "T");
      this.filter.dateRange = [startDate, endDate];
      if (this.filter.dateRange[0] && this.filter.dateRange[1]) {
        this.commitFilter();
      }
    },
    commitFilter() {
      this.$store.dispatch("getLightSpots", this.filter);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/helpers";

.filter-bar {
  box-sizing: border-box;

  &__item {
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  label {
    display: block;
    width: 100%;
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
    font-weight: bold;
    color: #666;
  }

  input {
    font-size: 0.8rem;
    width: 100%;
  }

  .selection-filter {
    overflow: hidden;
    padding-right: 20px;
    position: relative;
    // display: flex;
    // box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 1px 2px 0 rgba(#000, 0.05);
    box-sizing: border-box;
    border-radius: 4px;
    height: 2rem;

    &::before {
      content: "";
      display: block;
      padding: 3px;
      position: absolute;
      top: 50%;
      right: 10px;
      border: solid $c-black;
      border-width: 0 2px 2px 0;
      transform: translateY(-50%) rotate(45deg);
      transform-origin: 50% 50%;
    }

    select {
      font-size: 1rem;
      line-height: 2rem;
      height: 2rem;
      color: $c-black;
      padding: 0 0.5rem;
      border: none;
      border-radius: 0;
      box-shadow: none;
      background: transparent;
      background-image: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      width: 100%;

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
  