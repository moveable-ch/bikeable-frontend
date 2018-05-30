<!-- /entries -->

<template>
  <div class="list">
    <div class="list__controls">
      <div class="container">
        <div class="list__tabs">
          <region-switch></region-switch>
          <a href="#" class="list__tabs__item" @click.prevent="entryFilter = null" v-bind:class="{ active: isCurrentFilter(null) }">{{ $t('list.allspots') }}</a>
          <a href="#" class="list__tabs__item list__tabs__item--icon list__tabs__item--bad" @click.prevent="entryFilter = 'shamed'" v-bind:class="{ active: isCurrentFilter('shamed') }"><span>Shame</span></a>
          <a href="#" class="list__tabs__item list__tabs__item--icon list__tabs__item--good" @click.prevent="entryFilter = 'famed'" v-bind:class="{ active: isCurrentFilter('famed') }"><span>Fame</span></a>
        </div>
        <div class="list__sort">
          <span>{{ $t('list.sortby') }}:</span>
          <select v-model="entrySort" @change="setSort">
            <option value="date">{{ $t('list.date') }}</option>
            <option value="votes">{{ $t('list.upvotes') }}</option>
            <option v-if="userCoords" value="distance">{{ $t('list.distance') }}</option>
            <option value="comments">{{ $t('list.comments') }}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="container list__container">
      <div class="list__entries">
        <div class="list__entries__item" v-for="entry in listSpots" :key="entry._id">
          <c-entry-preview :entry="entry"></c-entry-preview>
        </div>
      </div>
      <a class="btn btn--centered" href="#" v-if="entryDisplayCapped && listSpots" @click.prevent="displayEntryCount += 12">{{ $t('list.morespots') }}</a>
    </div>
  </div>
</template>

<script>
import spots from '../api/spots';
import EntryPreview from '@/components/EntryPreview';
import RegionSwitch from '@/components/RegionSwitch';

export default {
  name: 'v-list',
  metaInfo: {
    title: 'Spots — Bikeable'
  },
  props: [],
  components: {
    'c-entry-preview': EntryPreview,
    'region-switch': RegionSwitch

  },
  computed: {
    allSpots() {
      return this.$store.getters.allSpots;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userCoords() {
      return this.$store.getters.userCoords;
    },
    listSort() {
      return this.$store.getters.listSort;
    },
    entryDisplayCapped() {
      return (this.displayEntryCount < this.allSpots.length);
    },
    selectedRegion() {
      return this.$store.getters.selectedRegion;
    }
  },
  data() {
    return {
      listSpots: [],
      entryFilter: null,
      entrySort: 'date',
      entrySortDesc: true,
      displayEntryCount: 24
    }
  },
  watch: {
    'entryFilter': function(to, from) {
      this.getSpots();
      this.displayEntryCount = 15;

      this.$store.commit('SET_LIST_FILTER', this.entryFilter);
    },
    'userCoords': function(to, from) {
      this.getSpots();
    },
    'displayEntryCount': function(to, from) {
      this.getSpots();
    },
    'selectedRegion' : function(to, from) {
      this.getSpots();
    }
  },
  methods: {
    getSpots() {
      this.$store.commit('LOAD_START');

      // let coords = null;
      // if(this.entrySort == 'distance') {
        let coords = this.userCoords ? this.userCoords : null;
      // }

      spots.getAllSpots({
          location: coords,
          limit: this.displayEntryCount,
          filter: this.entryFilter,
          sort: this.entrySort,
          region: this.selectedRegion
        })
        .then((entries) => {
          this.$store.commit('LOAD_FINISH');
          this.listSpots = entries;
        },
        (error) => {
          this.$store.commit('LOAD_FINISH');
          this.$store.dispatch('handleError', 'Fehler');
        });

    },
    setSort() {
      this.$store.commit('SET_LIST_SORT', this.entrySort);
      this.getSpots();
    },
    isCurrentFilter(filter) {
      return this.entryFilter == filter;
    },
    isCurrentSort(sort) {
      return this.entrySort == sort;
    }
  },
  mounted() {
    this.entrySort = this.$store.getters.listSort;
    this.entryFilter = this.$store.getters.listFilter;

    // this.getSpots();
    this.$store.dispatch('getAllSpots');
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.list {
  padding: 0 0 4rem 0;
  // background: #fafafa;
  margin-bottom: -1rem;

  @include tablet {
    padding: 0 0 4rem 0;
    margin-bottom: -8rem;
  }

  &__controls {
    background-image: linear-gradient(-127deg, #FCFFD6 0%, #E2FDFF 100%);
    padding-top: 5rem;
    position: relative;

    @include tablet {
      padding-top: 8rem;
    }
  }

  &__container {
    position: relative;
    padding: 0 .5rem;

    @include tablet {
      padding: 0 1rem;
    }
  }
  .addlink {
    display: block;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    text-decoration: none;
    font-size: 1rem;
    width: 100%;
    max-width: 400px;
    background-color: $c-main;
    color: #fff;
    font-weight: 400;
    margin: 0 auto;
    margin-bottom: 1.5rem;
    font-family: $f-head;
    font-weight: bold;

    &:hover {
      background-color: #333;
    }
  }
  .filter-item {
    margin-bottom: 5px;
    height: 1.5rem;
    overflow: hidden;
    font-family: $f-head;

    @include tablet() {
      height: auto;
    }

    &.visible {
      height: auto;

      h3::before {
        transform: rotate(-90deg);
      }
    }

    h3 {
      font-weight: 400;
      color: #333;
      margin: 0;
      font-size: 1rem;
      line-height: 1.5rem;
      margin-bottom: .25rem;
      color: #888;
      padding-left: 1rem;
      position: relative;

      &::before {
        content: ">";
        position: absolute;
        top: 0;
        line-height: 1.5rem;
        right: 1rem;
        transform: rotate(90deg);
      }

      @include tablet() {
        font-size: .8rem;

        &::before {
          display: none;
        }
      }
    }
    &__list {
      margin-bottom: 1.5rem;

      li {

        a {
          background-color: #fff;
          display: block;
          text-decoration: none;
          color: #666;
          line-height: 2rem;
          padding: 0 1rem;
          margin-bottom: 5px;
          border: 2px solid #fff;
          position: relative;
          // border-radius: 4px;
          transition: .2s color, .2s border-color;

          &:hover, &.active {
            border-color: $c-black;
            color: $c-black;
          }
          &.disabled {
            opacity: .4;
            pointer-events: none;
          }
        }
      }
    }
    &--sort {
      .filter-item__list li a {
        &.active::before {
          content: "⇥";
          color: inherit;
          display: block;
          position: absolute;
          right: .5rem;
          top: 0;
          line-height: 2rem;
          transform: rotate(90deg);
          transition: .4s transform $easeOutQuint;
        }
        &.active.asc::before {
          transform: rotate(-90deg);
        }
      }
    }
  }

  .list__entries {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    @include tablet() {
      margin-top: 0;
    }

    &__item {
      width: 100%;

      @include tablet {
        width: calc(50% - 1rem);
      }
      @include desktop {
        width: calc(33.3% - 1.33rem);
      }
    }
  }

  &__tabs {
    margin: 0 0 1rem 0;
    margin-bottom: 2.5rem;

    @include tablet() {
      padding-bottom: 0;
      margin-bottom: 2rem;
    }

    &__item {
      display: inline-block;
      text-decoration: none;
      padding: 0 .5rem;
      width: 32%;
      font-size: .7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: .02rem;
      white-space: nowrap;
      text-align: center;
      height: 2rem;
      line-height: 2rem;
      position: relative;
      bottom: 0;
      background-color: #fafafa;
      box-sizing: border-box;
      color: lighten($c-black, 60%);
      margin-right: -2px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;

      @include tablet() {
        width: 7rem;
        font-size: .7rem;
      }

      &:hover::before {
        opacity: 1;
      }

      &.active {
        background-color: #fff;
        color: $c-black;
      }

      &--icon {
        span {
          visibility: hidden;
        }

        &::before {
          content: "";
          display: block;
          width: 20px;
          height: 20px;
          background-size: 100%;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -10px;
          margin-top: -10px;
          background-image: url('../assets/tab-shame.png');
          opacity: .4;

          @include retina {
            background-image: url('../assets/tab-shame@2x.png');
          }
          @include tablet {
            width: 27px;
            height: 27px;
            margin-left: -13px;
            margin-top: -13px;
          }
        }

        &.active {

          &::before {
            opacity: 1;
          }
        }
      }
      &--good {
        &::before {
          background-image: url('../assets/tab-fame.png');
          @include retina {
            background-image: url('../assets/tab-fame@2x.png');
          }
        }
      }
    }
  }

  &__sort {
    position: absolute;
    top: 2rem;
    right: 1rem;
    font-size: .8rem;

    @include tablet() {
      bottom: 0;
      right: 1rem;
      top: auto;
    }

    select {
      font-family: $f-body;
      color: $c-black;
      padding: 0;
      font-size: .8rem;
      font-weight: 600;
      width: auto;
      border: none;
      text-decoration: underline;
      border-radius: 0;
      box-shadow: none;
      background: transparent;
      background-image: none;
      -webkit-appearance: none;
      line-height: 2rem;
      margin-left: .5rem;

      &::-ms-expand {
        display: none;
      }

      &:focus {
        outline: none;
        color: #333;
        border-color: #333;
      }

      @include tablet() {
        border-bottom: none;
      }
    }
  }
}


.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for <2.1.8 */ {
  opacity: 0;
  // transform: translateX(30px);
}
.list-complete-leave-active {
  position: absolute;
}

</style>
