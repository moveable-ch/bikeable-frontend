<!-- /entries/my -->

<template>
  <div class="list">
    <div class="list__head">
      <div>
        <div class="container">
          <router-link class="list__head__add" to="/add">{{ $t('home.addspot') }}</router-link>
        </div>
      </div>
      <div class="list__controls">
        <div class="container">
          <div class="list__sort">
            <span>{{ $t('list.sortby') }}:</span>
            <select v-model="entrySort" @change="setSort">
              <option value="date">{{ $t('list.date') }}</option>
              <option value="votes">{{ $t('list.upvotes') }}</option>
              <option value="comments">{{ $t('list.comments') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="container list__container">
      <p v-if="listSpots.length < 1">{{ $t('list.nospots') }}</p>
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

export default {
  name: 'v-list',
  metaInfo: {
    title: 'Spots — Bikeable'
  },
  props: [],
  components: {
    'c-entry-preview': EntryPreview
  },
  computed: {
    mySpots() {
      return this.$store.getters.mySpots;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    listSort() {
      return this.$store.getters.listSort;
    },
    entryDisplayCapped() {
      return (this.displayEntryCount == this.listSpots.length);
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
    'displayEntryCount': function(to, from) {
      this.getSpots();
    }
  },
  methods: {
    getSpots() {
      this.$store.commit('LOAD_START');

        spots.getMySpots({
          limit: this.displayEntryCount,
          filter: this.entryFilter,
          sort: this.entrySort
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

    this.getSpots();
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

  &__head {
    background-image: linear-gradient(-127deg, #FCFFD6 0%, #E2FDFF 100%);
    padding-top: 5rem;
    position: relative;
    margin-bottom: 2rem;

    @include tablet {
      padding-top: 8rem;
    }

    &__add {
      display: block;
      margin-bottom: .5rem;
      margin-top: -.75rem;
      margin-left: -1rem;
      width: calc(100% + 2rem);
      background-color: rgba($c-main, .6);
      color: #fff;
      position: relative;
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 1rem 0 1rem;
      transition: .1s background-color, .1s border-color;
      text-align: center;
      box-sizing: border-box;

      &::before {
        content: "✚";
        margin-right: .5rem;
      }
      &:hover {
        border-color: $c-main;
        background-color: rgba(#fff, .5);
        color: $c-main;
      }

      @include tablet {
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        right: 2rem;
        background-color: transparent;
        border-radius: 1rem;
        color: $c-main;
        border: 2px solid rgba($c-main, .3);
        margin-top: 0;
        height: 1.75rem;
        line-height: 1.75rem;
        width: auto;
        z-index: 1;
        box-sizing: content-box;
      }
    }
  }
  &__controls {
    background-color: rgba($c-black, .1);
    padding: .75rem 0;
  }

  &__container {
    position: relative;
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
    // position: absolute;
    // top: 2rem;
    // right: 1rem;
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
      -moz-appearance: none;
      line-height: 1;
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
