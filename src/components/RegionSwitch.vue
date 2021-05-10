<template>
  <div class="regionswitch">
    <label for="type">{{ $t("list.region") }}</label>
    <div class="regionswitch__select">
      <select v-model="currentRegion">
        <option value="">{{ $t("list.allregions") }}</option>
        <option
          v-for="region in regions"
          v-bind:value="region._id"
          v-bind:key="region._id"
        >
          {{ region.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import regions from "../api/regions";

export default {
  name: "region-switch",
  props: [],
  data() {
    return {
      currentRegion: "",
      regions: [],
      switcherVisible: false,
    };
  },
  computed: {
    selectedRegion() {
      return this.$store.getters.selectedRegion;
    },
  },
  watch: {
    currentRegion(to, from) {
      this.setRegion(to);
    },
    selectedRegion(to, from) {
      this.currentRegion = this.selectedRegion;
    },
  },
  mounted() {
    this.loadRegions();

    if (this.selectedRegion != "") {
      this.currentRegion = this.selectedRegion;
    }
  },
  methods: {
    loadRegions() {
      this.$store.commit("LOAD_START");

      regions.getRegions().then(
        (result) => {
          this.$store.commit("LOAD_FINISH");
          this.regions = result;
          if (this.currentRegion == null) {
            this.currentRegion = regions[0];
          }
        },
        (error) => {
          this.$store.commit("LOAD_FINISH");
          this.$store.dispatch("handleError", "Fehler");
        }
      );
    },
    setRegion(region) {
      this.switcherVisible = false;

      this.$store.dispatch("setSelectedRegion", region).then(
        (data) => {
          this.region;
        },
        (data) => {
          this.$store.dispatch("handleError", "Error");
        }
      );
    },
  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.regionswitch__select {
  max-width: 100%;
  padding-right: 20px;
  position: relative;
  // display: flex;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 1px 3px 0 rgba(#000, 0.1);
  box-sizing: border-box;
  border-radius: 4px;
  // margin: 0 1rem 0 0;

  &::before {
    content: "";
    display: block;
    padding: 3px;
    position: absolute;
    top: 50%;
    right: 10px;
    margin-top: -2px;
    border: solid $c-black;
    border-width: 0 2px 2px 0;
    transform: translateY(-50%) rotate(45deg);
    transform-origin: 50% 50%;
  }

  select {
    width: 100%;
    font-size: 1rem;
    line-height: 1.2;
    color: $c-black;
    padding: 0.5rem;
    height: auto;
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
