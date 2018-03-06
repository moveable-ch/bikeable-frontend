<!-- /entries -->

<template>
  <div class="list">
    <div class="list__controls">
      <div class="container">
        <div class="list__tabs">
          <a href="#" class="list__tabs__item" @click.prevent="entryFilter = null" v-bind:class="{ active: isCurrentFilter(null) }">Alle Spots</a>
          <a href="#" class="list__tabs__item list__tabs__item--icon list__tabs__item--bad" @click.prevent="entryFilter = 'shamed'" v-bind:class="{ active: isCurrentFilter('shamed') }"><span>Shame</span></a>
          <a href="#" class="list__tabs__item list__tabs__item--icon list__tabs__item--good" @click.prevent="entryFilter = 'famed'" v-bind:class="{ active: isCurrentFilter('famed') }"><span>Fame</span></a>
        </div>
        <div class="list__sort">
          <span>Sortieren nach:</span>
          <select v-model="entrySort" @change="setSort">
            <option value="date">Aktualität</option>
            <option value="votes">Beliebtheit</option>
            <option v-if="userCoords" value="distance">Nähe</option>
            <option value="comments">Kommentare</option>
          </select>
        </div>
      </div>
    </div>
    <div class="container list__container">
      <ul class="list__entries">
        <li v-for="entry in listSpots" class="list-entry" v-if="listSpots" v-bind:class="{ famed: entry.famed }" v-bind:key="entry._id">
          <router-link :to="'/entries/' + entry._id" class="list-entry__link">
            <span class="list-entry__image" :style="{ backgroundImage: 'url(' + entry.photo.small.url + ')' }"></span>
            <span class="list-entry__content">
              <span class="list-entry__date">{{ formatDate(entry.createdAt) }} — {{ entry.user.name }}</span>
              <h3>{{ entry.title }}</h3>
              <span class="list-entry__location">{{ entry.address }}</span>
              <span v-if="entry.humanizedDistance" class="list-entry__distance">{{ entry.humanizedDistance }} entfernt</span>
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
      entrySort: 'date',
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
  padding: 0 0 4rem 0;
  // background: #fafafa;
  margin-bottom: -1rem;

  @include desktop {
    padding: 0 0 4rem 0;
    margin-bottom: -8rem;
  }

  &__controls {
    background-image: linear-gradient(-127deg, #FCFFD6 0%, #E2FDFF 100%);
    padding-top: 3rem;
    position: relative;

    @include desktop {
      padding-top: 8rem;
    }
  }

  &__container {
    position: relative;
    padding: 0 .5rem;

    @include desktop {
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

  ul.list__entries {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-top: 1rem;

    @include desktop() {
      margin-top: 0;
    }

    .list-entry {
      // margin-bottom: .5rem;
      border-bottom: 1px solid $c-grey-dark;

      &__distance {
        display: block;
        color: lighten($c-black, 40%);
        font-size: .8rem;
        font-weight: 400;
      }
      &__location {
        display: block;
        font-size: .8rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        margin-bottom: .2rem;
        font-family: $f-body;
        line-height: 1.3;
        // color: #888;
      }
      &__date {
        display: block;
        font-size: .8rem;
        margin-bottom: .4rem;
      }
      &__link {
        display: block;
        padding-left: 6rem;
        width: 100%;
        margin: 0 auto;
        text-decoration: none;
        color: #333;
        background-color: #fff;
        // border: 1px solid $c-grey-dark;
        box-sizing: border-box;
        position: relative;
        // transition: .2s background-color;
        // border-radius: 4px;
        overflow: hidden;

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
          border-color: #ccc;

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
          padding-left: 10rem;
        }
      }
      &__content {
        display: block;
        // overflow: hidden;
        text-overflow: ellipsis;
        padding: .75rem 1rem;
        position: relative;
        z-index: 2;

        @include desktop {
          padding: 1rem 1.5rem;
        }
      }
      &__image {
        position: absolute;
        top: 10%;
        left: 0;
        display: block;
        width: 6rem;
        height: 80%;
        background-size: cover;
        background-position: center;

        @include desktop() {
          width: 10rem;
          height: 80%;
          top: 10%;
        }
      }
      &__meta {
        position: relative;
        display: inline-block;
        padding-left: 24px;
        margin-right: 1rem;
        margin-top: 1rem;
        // color: #888;
        font-family: $f-body;
        font-size: .8rem;
        font-weight: 600;
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
        }
        &--votes::before {
          background-image: url('../assets/upvote-small-filled.png');
          @include retina {
            background-image: url('../assets/upvote-small-filled@2x.png');
          }
        }
        &--comments {
          padding-left: 26px;
        }
        &--comments::before {
          background-image: url('../assets/comment-small-filled.png');
          @include retina {
            background-image: url('../assets/comment-small-filled@2x.png');
          }
        }
      }
      h3 {
        font-family: $f-body;
        text-transform: none;
        font-size: .9rem;
        font-weight: 400;
        margin-bottom: .25rem;
        margin-top: .25rem;
        color: $c-black;
        // transition: .2s color;
        position: relative;
        padding-left: 0;
        line-height: 1.1;
        padding-top: 6px;
        padding-bottom: 10px;

        @include desktop {
          line-height: 32px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding: 0;
          padding-left: 45px;
        }

        &::before {
          content: "";
          display: block;
          position: absolute;
          top: 0;
          left: -38px;
          width: 32px;
          height: 32px;
          background-size: 100%;
          background-repeat: no-repeat;
          background-image: url('../assets/list-icon-shame.png');
          @include retina {
            background-image: url('../assets/list-icon-shame@2x.png');
          }

          @include desktop {
            left: 0;
            width: 32px;
            height: 32px;
          }
        }
      }

      &.famed {
        // border-color: $c-main;

        .list-entry__link::after {
          background-image: linear-gradient(90deg, rgba($c-main, .3) 0%, #fff 70%);
        }
        .list-entry__link:hover h3, .list-entry__link:focus h3 {
          color: $c-main;
        }
        h3::before {
          background-image: url('../assets/list-icon-fame.png');
          @include retina {
            background-image: url('../assets/list-icon-fame@2x.png');
          }
        }
      }

    }
  }
  .showmore {
    display: block;
    text-align: center;
    margin: 2rem auto 0 auto;
    background-color: #fff;
    color: $c-black;
    border: 1px solid $c-grey-dark;
    max-width: 10rem;
    padding: .75rem 1rem;
    text-decoration: none;
    font-size: .8rem;
    border-radius: 4px;
    width: 100%;

    &:hover {
      border-color: $c-black;
    }
  }

  &__tabs {
    margin: 0 0 1rem 0;
    margin-bottom: 2.5rem;

    @include desktop() {
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

      @include desktop() {
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
          @include desktop {
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

    @include desktop() {
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
