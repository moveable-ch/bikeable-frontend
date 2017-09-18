<template>
  <div class="list">
    <div class="container list__container">
      <!--<router-link v-if="isLoggedIn" to="/add" class="addlink">Spot hinzufügen</router-link>-->
      <div class="list__sort">
        <select v-model="entrySort" @change="setSort">
          <option value="votes">Upvotes</option>
          <option v-if="userCoords" value="distance">Distanz</option>
          <option value="comments">Kommentare</option>
          <option value="date">Datum</option>
        </select>
      </div>
      <div class="list__tabs">
        <a href="#" class="list__tabs__item" @click.prevent="entryFilter = null" v-bind:class="{ active: isCurrentFilter(null) }">Alle Spots</a>
        <a href="#" class="list__tabs__item list__tabs__item--icon list__tabs__item--bad" @click.prevent="entryFilter = 'shamed'" v-bind:class="{ active: isCurrentFilter('shamed') }"><span>Shame</span></a>
        <a href="#" class="list__tabs__item list__tabs__item--icon list__tabs__item--good" @click.prevent="entryFilter = 'famed'" v-bind:class="{ active: isCurrentFilter('famed') }"><span>Fame</span></a>
      </div>
      <ul class="list__entries">
        <li v-for="entry in listSpots" class="list-entry" v-if="listSpots" v-bind:class="{ famed: entry.famed }" v-bind:key="entry._id">
          <router-link :to="'/entries/' + entry._id" class="list-entry__link">
            <span class="list-entry__image" :style="{ backgroundImage: 'url(' + entry.photo.small.url + ')' }"></span>
            <span class="list-entry__content">
              <h3>{{ entry.title }}</h3>
              <span class="list-entry__date">{{ formatDate(entry.createdAt) }}</span>
              <span class="list-entry__location">{{ entry.address }}</span>
              <span v-if="entry.distance" class="list-entry__distance">{{ entry.distance }}m entfernt</span>
              <span class="list-entry__meta list-entry__meta--votes">{{ entry.votes }}</span>
              <span class="list-entry__meta list-entry__meta--comments">{{ entry.commentCount }}</span>
            </span>
          </router-link>
        </li>
      </ul>
      <a class="showmore" href="#" v-if="entryDisplayCapped && listSpots" @click.prevent="displayEntryCount += 10">Mehr Spots anzeigen</a>
    </div>
  </div>
</template>

<script>
import spots from '../api/spots';

export default {
  name: 'v-list',
  metaInfo: {
    title: 'Spots — Bikeable'
  },
  props: [],
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
      // return true;
      return (this.displayEntryCount < this.allSpots.length);
    }
  },
  data() {
    return {
      listSpots: [],
      entryFilter: null,
      entrySort: 'votes',
      entrySortDesc: true,
      displayEntryCount: 15
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
    },
    formatDate(date) {
      if(!date) return '';
      let d = new Date(date);
      return d.toLocaleDateString('de-DE');
    }
  },
  mounted() {
    this.entrySort = this.$store.getters.listSort;
    this.entryFilter = this.$store.getters.listFilter;

    this.getSpots();
    this.$store.dispatch('getAllSpots');
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.list {
  padding: 1rem 0 4rem 0;

  @include desktop {
    padding: 2rem 1rem;
  }

  &__container {
    position: relative;
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
    font-weight: 500;
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

    @include desktop() {
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

      @include desktop() {
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
          background-color: #f8f8f8;
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
            border-color: $c-main;
            color: $c-main;
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

  ul.list__entries {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-top: 1rem;

    @include desktop() {
      margin-top: 0;
    }

    .list-entry {
      margin-bottom: 1rem;
      // border: 2px solid lighten($c-highlight, 35%);
      // padding: 2px;

      &__distance {
        display: block;
        color: #000;
        font-size: .7rem;
        font-weight: 700;
      }
      &__location {
        display: block;
        font-size: .75rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        margin-bottom: .2rem;
        font-family: $f-body;
        color: #888;
      }
      &__date {
        display: block;
        font-size: .7rem;
        color: #888;
        margin-bottom: .2rem;
      }
      &__link {
        display: flex;
        align-items: top;
        width: 100%;
        margin: 0 auto;
        text-decoration: none;
        color: #333;
        // background-color: #fafafa;
        // padding: .5rem;
        box-sizing: border-box;
        // border-left: 4px solid $c-highlight;
        position: relative;
        transition: .2s background-color;

        &::after {
          content: "";
          display: none;
          width: 100%;
          height: 100%;
          background-color: #fff;
          background-image: linear-gradient(90deg, rgba($c-highlight, .2) 0%, rgba($c-highlight, .01) 100%);
          position: absolute;
          left: 0;
          top: 0;
        }

        &:hover, &:focus {
          background-color: #fafafa;

          h3 {
            color: $c-highlight;
            // text-decoration: underline;
          }
          .list-entry__image::after {
            opacity: 0;
          }
          .list-entry__meta {
            color: #333;

            &::before {
              opacity: 1;
            }
          }
        }

        @include desktop() {
          // padding: 1rem;
        }
      }
      &__content {
        flex-shrink: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        z-index: 1;
      }
      &__image {
        flex-shrink: 0;
        display: block;
        width: 5rem;
        height: 6rem;
        background-size: cover;
        background-position: center;
        margin: 0 1rem 0 0;
        position: relative;
        overflow: hidden;
        z-index: 1;
        box-sizing: border-box;
        box-shadow: 4px 4px 0 0 $c-highlight;

        &::after {
          content: "";
          display: none;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: $c-highlight;
          opacity: .2;
          mix-blend-mode: color;
          transition: .2s opacity;
          // transition: .1s opacity;
        }

        @include desktop() {
          width: 10rem;
          height: 7rem;
          margin: 0 1rem 0 0;
        }
      }
      &__meta {
        position: relative;
        display: inline-block;
        padding-left: 24px;
        margin-right: 1rem;
        margin-top: .7rem;
        color: #888;
        font-family: $f-body;
        transition: .2s color;

        &::before {
          content: "";
          display: block;
          width: 18px;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-size: 100%;
          background-position: center;
          background-repeat: no-repeat;
          opacity: .5;
          transition: .2s opacity;
        }
        &--votes::before {
          background-image: url('../assets/upvote-small-filled.png');
        }
        &--comments {
          padding-left: 26px;
        }
        &--comments::before {
          background-image: url('../assets/comment-small-filled.png');
        }
      }
      h3 {
        font-family: $f-body;
        text-transform: none;
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: .5rem;
        color: #000;
        transition: .2s color;
        line-height: 1.1;
        margin-top: .5rem;

        @include desktop() {
          font-size: 1.1rem;
        }
      }

      &.famed {
        border-color: $c-main;

        .list-entry__link::after {
          background-image: linear-gradient(90deg, rgba($c-main, .3) 0%, #fff 70%);
        }
        .list-entry__link:hover h3, .list-entry__link:focus h3 {
          color: $c-main;
        }
        .list-entry__link {
          border-color: $c-main;
        }
        .list-entry__image {
          box-shadow: 4px 4px 0 0 $c-main;
        }
      }

    }
  }
  .showmore {
    display: block;
    text-align: center;
    margin: 4rem auto 0 auto;
    border: 2px solid $c-main;
    max-width: 10rem;
    padding: 1rem;
    text-decoration: none;
    font-size: .8rem;
    color: #000;
    width: 100%;

    &:hover {
      color: $c-main;
    }
  }

  &__tabs {
    margin: 1rem 0 1rem 0;
    border-bottom: 1px solid #ddd;
    margin-bottom: 3.5rem;
    padding-left: .5rem;

    @include desktop() {
      padding-bottom: 0;
      margin-bottom: 2rem;
    }

    &__item {
      display: inline-block;
      text-decoration: none;
      padding: 0 1rem;
      width: 32%;
      font-size: .75rem;
      text-align: center;
      height: 2rem;
      line-height: 2rem;
      border: 1px solid #ddd;
      color: #888;
      position: relative;
      bottom: -1px;
      background-color: #fafafa;
      box-sizing: border-box;

      @include desktop() {
        width: 7rem;
      }

      &.active {
        border-color: $c-main;
        border-bottom-color: #fff;
        background-color: #fff;
        color: $c-main;
      }

      &--icon {
        span {
          visibility: hidden;
        }

        &::before {
          content: "";
          display: block;
          width: 2.5rem;
          height: 2.5rem;
          background-size: 100%;
          position: absolute;
          top: -.25rem;
          left: 50%;
          margin-left: -1.25rem;
          background-image: url('../assets/thumbs-down.png');
          opacity: .6;
          transform: scale(.8);
          transition: .2s transform $easeOutQuint, .2s opacity;
        }

        &.active {

          &::before {
            opacity: 1;
            transform: scale(1);
          }
        }
      }
      &--good {
        &::before {
          background-image: url('../assets/thumbs-up.png');
        }
      }
    }
  }

  &__sort {
    position: absolute;
    top: 2.5rem;
    right: 1rem;

    @include desktop() {
      top: 0;
    }

    &::after {
      content: "↙";
      position: absolute;
      left: 0rem;
      top: .5rem;
      color: #888;
      pointer-events: none;
      transform: rotate(-45deg);
    }

    select {
      font-family: $f-body;
      color: #888;
      padding: 0;
      font-size: .9rem;
      width: 100%;
      border: none;
      border-radius: 0;
      box-shadow: none;
      background: transparent;
      background-image: none;
      -webkit-appearance: none;
      padding-left: 1.5rem;
      line-height: 2rem;

      &::-ms-expand {
        display: none;
      }

      &:focus {
        outline: none;
        color: #333;
        border-color: #333;
      }

      @include desktop() {
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
