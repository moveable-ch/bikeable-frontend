<template>
  <div class="regionswitch">
    <a href="#" class="regionswitch__current" @click.prevent="switcherVisible = !switcherVisible">{{ currentRegion.name }}</a>
    <transition name="switcher-anim">
      <div class="regionswitch__switcher" v-if="switcherVisible">
        <ul>
          <li v-for="region in regions"><a href="#" @click="setRegion(region)">{{ region.name }}</a></li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import regions from '../api/regions';

export default {
  name: 'region-switch',
  props: [],
  data () {
    return {
      regions: [],
      currentRegion: {
        "_id": "ub4HbeAnsZDCTiHQ7",
        "name": "Stadt Zürich"},
      switcherVisible: false
    }
  },
  computed: {
    // selectedRegion() {
    //   return this.$store.getters.selectedRegion;
    // }
  },
  watch: {
  },
  mounted() {
    this.loadRegions();
  },
  methods: {

  loadRegions() {
      console.log("LOAD_START");

      this.$store.commit('LOAD_START');

      regions.getRegions()
        .then((result) => {
          console.log("result");
          console.log(result);
          this.$store.commit('LOAD_FINISH');
          this.regions = result;
          if(this.currentRegion == null) {
            this.currentRegion = regions[0];
          }
        },
        (error) => {
          this.$store.commit('LOAD_FINISH');
          this.$store.dispatch('handleError', 'Fehler');
      });
    }
  },
  setRegion(region) {
    this.currentRegion = region;
    this.switcherVisible = false;

    this.$store.dispatch('setRegion', region)
    .then((data) => {
      this.region
      }, (data) => {
        this.$store.dispatch('handleError', 'Error');
      });
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.regionswitch {
  display: inline-block;
  position: relative;

  &__current {
    text-transform: uppercase;
    position: relative;
    padding-right: 15px;

    &::after {
      content: "";
      display: block;
      width: 0; 
      height: 0; 
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #869098;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
    &:hover::after {
      border-top: 5px solid $c-black;
    }
  }

  &__switcher {
    position: absolute;
    top: calc(100% + 10px);
    left: 50%;
    background-color: #fff;
    width: 100px;
    padding: 1rem 1.5rem;
    border-radius: 4px;
    box-shadow: 0 4px 30px -5px rgba(#000, .1);
    transform: translateX(-50%);

    &::before {
      content: "";
      display: block;
      width: 0; 
      height: 0; 
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid white;
      position: absolute;
      top: -5px;
      left: 50%;
      transform: translateX(-50%);
    }

    ul {
      li {
        display: block;
        line-height: 1;
        text-align: center;
        margin: .5rem 0;

        a {
          line-height: 1;
        }
      }
    }
  }
}

.switcher-anim-enter-active, .switcher-anim-leave-active {
  transition: opacity .4s $easeOutQuint, transform .4s $easeOutQuint;
}
.switcher-anim-enter {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
.switcher-anim-enter-to {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.switcher-anim-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

</style>
