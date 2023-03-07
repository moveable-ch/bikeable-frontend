<!-- /entries -->

<template>
  <div class="list">
    <div class="list__head">
      <div class="list__regions" v-if="!filterByUserIdCommented">
        <div class="container">
          <button
            @click="showMobileFilter = !showMobileFilter"
            class="btn-showfilter"
            :class="{ active: showMobileFilter }"
          >
            <span>Filter Entries</span>
          </button>
          <c-list-filter-bar :showMobile="showMobileFilter"></c-list-filter-bar>
        </div>
      </div>
      <div class="list__controls" v-if="!filterByUserIdCommented">
        <div class="container">
          <div class="list__sort">
            <span>{{ $t("list.sortby") }}:</span>
            <select v-model="entrySort" @change="setSort">
              <option value="date">{{ $t("list.date") }}</option>
              <option value="votes">{{ $t("list.upvotes") }}</option>
              <option v-if="userCoords" value="distance">
                {{ $t("list.distance") }}
              </option>
              <option value="comments">{{ $t("list.comments") }}</option>
            </select>
          </div>
          <router-link class="list__head__add" to="/add" v-if="isLoggedIn"
            ><span class="material-icons">add</span
            >{{ $t("home.addspot") }}</router-link
          >
        </div>
      </div>
    </div>
    <div class="container list__container">
      <p v-if="listSpots.length < 1">{{ $t("list.nospots") }}</p>
      <div class="list__entries">
        <div
          class="list__entries__item"
          v-for="entry in listSpots"
          :key="entry._id"
        >
          <c-entry-preview :entry="entry"></c-entry-preview>
        </div>
      </div>
      <a
        class="btn btn--centered"
        href="#"
        v-if="entryDisplayCapped && listSpots"
        @click.prevent="displayEntryCount += 12"
        >{{ $t("list.morespots") }}</a
      >
    </div>
  </div>
</template>

<script>
import spots from "../api/spots";
import EntryPreview from "@/components/EntryPreview";
import ListFilterBar from "@/components/ListFilterBar";

export default {
  name: "v-list",
  metaInfo: {
    title: "Spots — Bikeable",
  },
  props: [],
  components: {
    "c-entry-preview": EntryPreview,
    "c-list-filter-bar": ListFilterBar,
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
      return this.displayEntryCount == this.listSpots.length;
    },
    selectedRegion() {
      return this.$store.getters.selectedRegion;
    },
    listFilter() {
      return this.$store.getters.listFilter;
    },
    isEmbed() {
      return this.$route.query.embed;
    },
    filterByUserId() {
      return this.$route.query.user;
    },
    filterByUserIdCommented() {
      return this.$route.query.commentedby;
    },
    currentCountry() {
      return this.$store.getters.country;
    }
  },
  data() {
    return {
      listSpots: [],
      entrySort: "date",
      entrySortDesc: true,
      displayEntryCount: 24,
      showMobileFilter: false,
    };
  },
  watch: {
    userCoords: function (to, from) {
      this.getSpots();
    },
    displayEntryCount: function (to, from) {
      this.getSpots();
    },
    selectedRegion: function (to, from) {
      this.getSpots();
    },
    listFilter: {
      deep: true,
      handler() {
        this.displayEntryCount = 15;
        this.getSpots();
      },
    },
  },
  methods: {
    getSpots() {

      if (this.filterByUserIdCommented) {
          // TODO: Move to Store
          let userId = this.filterByUserIdCommented;

          this.$store.commit("LOAD_START");

          return new Promise((resolve, reject) => {
            spots.getSpotsCommentedByUserId(userId).then(
              (data) => {
                this.listSpots = data.filter((e) => {
                  return e.userId != userId;
                });

                this.$store.commit("LOAD_FINISH");
                this.$emit("updateHead");
                resolve();
              },
              (error) => {
                this.$store.commit("LOAD_FINISH");
                this.$router.push("/");
                this.$store.dispatch("handleError", "User nicht gefunden");
              }
            );
          });

      } else {
        // TODO: Move to Store
        this.$store.commit("LOAD_START");

        let coords = this.userCoords ? this.userCoords : null;

        return new Promise((resolve, reject) => {
          spots
            .getAllSpots({
              location: coords,
              limit: this.displayEntryCount,
              filter: this.listFilter,
              sort: this.entrySort,
              region: this.selectedRegion,
              country: this.currentCountry,
              user: this.$route.query.user || null,
            })
            .then(
              (entries) => {
                this.$store.commit("LOAD_FINISH");
                this.listSpots = entries;
              },
              (error) => {
                this.$store.commit("LOAD_FINISH");
                this.$store.dispatch("handleError", "Fehler");
              }
            );
          });
        }
    },    
    setSort() {
      this.$store.commit("SET_LIST_SORT", this.entrySort);
      this.getSpots();
    },
    isCurrentFilter(filter) {
      return this.entryFilter == filter;
    },
    isCurrentSort(sort) {
      return this.entrySort == sort;
    },
  },
  mounted() {
    this.entrySort = this.$store.getters.listSort;
    this.entryFilter = this.$store.getters.listFilter;

    this.getSpots();
    // this.$store.dispatch('getAllSpots');
  },
};
</script>

<style lang="scss">
@import "../styles/helpers";

.list {
  padding: 0 0 4rem 0;
  // background: #fafafa;
  margin-bottom: -1rem;

  @include tablet {
    padding: 0 0 4rem 0;
    margin-bottom: -8rem;
  }

  &__head {
    background-image: linear-gradient(-127deg, #fcffd6 0%, #e2fdff 100%);
    padding-top: 5rem;
    position: relative;
    margin-bottom: 2rem;

    @include tablet {
      padding-top: 8rem;
    }

    .embed & {
      padding-top: 0;
    }

    &__add {
      display: block;
      margin-bottom: -0.75rem;
      margin-top: 0.5rem;
      margin-left: -1rem;
      width: calc(100% + 2rem);
      background-color: rgba($c-main, 0.6);
      color: #fff;
      position: relative;
      height: 2.5rem;
      line-height: 2.5rem;
      padding: 0 1rem;
      // transition: .1s background-color, .1s border-color;
      text-align: center;
      box-sizing: border-box;

      &:hover {
        border-color: $c-main;
        background-color: rgba(#fff, 0.5);
        color: $c-main;
      }

      .material-icons {
        line-height: 2.5rem;
        font-size: 1.25rem;
        margin-right: 0.25rem;
        display: inline-block;
        vertical-align: middle;
        position: relative;
        bottom: 2px;
      }

      @include tablet {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 2rem;
        background-color: #fff;
        border-radius: 4px;
        color: $c-main;
        // border: 1px solid $c-main;
        margin-top: 0;
        height: 1.75rem;
        line-height: 1.75rem;
        width: auto;
        z-index: 1;
        box-sizing: content-box;
        padding-left: 2.5rem;
        font-size: 0.9rem;
        font-weight: bold;
        box-shadow: 2px 2px 6px 0 rgba(#000, 0.05);

        .material-icons {
          display: block;
          height: 1.75rem;
          width: 1.75rem;
          line-height: 1.75rem;
          position: absolute;
          top: 0;
          left: 0;
          font-size: 1.25rem;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          background-color: $c-main;
          color: #fff;
        }
        &:hover {
          background: #fff;
          color: #333;
        }
      }
    }
  }
  &__regions {
    background-color: rgba($c-black, 0.05);
    padding: 0.75rem 0;
    position: relative;
  }
  &__controls {
    background-color: rgba($c-black, 0.1);
    padding: 0.75rem 0;
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
      padding: 0 0.5rem;
      width: 32%;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.02rem;
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
        font-size: 0.7rem;
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
          background-image: url("../assets/tab-shame.png");
          opacity: 0.4;

          @include retina {
            background-image: url("../assets/tab-shame@2x.png");
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
          background-image: url("../assets/tab-fame.png");
          @include retina {
            background-image: url("../assets/tab-fame@2x.png");
          }
        }
      }
    }
  }

  &__sort {
    // position: absolute;
    // top: 2rem;
    // right: 1rem;
    font-size: 0.8rem;

    @include tablet() {
      bottom: 0;
      right: 1rem;
      top: auto;
    }

    select {
      font-family: $f-body;
      color: $c-black;
      padding: 0;
      font-size: 0.8rem;
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
      margin-left: 0.5rem;

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

.btn-showfilter {
  display: block;
  font-size: 1rem;
  width: 100%;
  line-height: 2rem;
  padding: 0;
  border: none;
  background: #fafafa;
  border-bottom: 1px solid #ddd;

  span {
    display: inline-block;
    position: relative;
    padding-right: 1rem;

    &::after {
      content: "";
      display: block;
      position: absolute;
      right: 0;
      top: 50%;
      width: 4px;
      height: 4px;
      margin-left: 0.5rem;
      border: 2px solid #000;
      border-left-width: 0;
      border-top-width: 0;
      transform: translateY(-50%) rotate(45deg);
    }
  }

  &.active span::after {
    transform: translateY(-50%) rotate(-135deg);
  }

  &:focus,
  &:active {
    outline: none;
  }

  @include tablet() {
    display: none;
  }
}
</style>
