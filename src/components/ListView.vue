<template>
  <div class="list">
    <div class="list__container">
      <div class="col col--left">
        <router-link v-if="isLoggedIn" to="/add" class="addlink">Spot hinzufügen</router-link>
        <div class="filter-item filter-item--filter" v-bind:class="{ visible: showFilter }">
          <h3 @click="showFilter = !showFilter">Filter</h3>
          <ul class="filter-item__list">
          <li><a href="#" @click.prevent="entryFilter = 'all'" v-bind:class="{ active: isCurrentFilter('all') }">Alle Spots</a></li>
          <li><a href="#" @click.prevent="entryFilter = 'shame'" v-bind:class="{ active: isCurrentFilter('shame') }">Wall of Shame</a></li>
          <li><a href="#" @click.prevent="entryFilter = 'fame'" v-bind:class="{ active: isCurrentFilter('fame') }">Hall of Fame</a></li>
          </ul>
        </div>
        <div class="filter-item filter-item--sort" v-bind:class="{ visible: showSort }">
          <h3 @click="showSort = !showSort">Sortierung</h3>
          <ul class="filter-item__list">
            <li><a href="#" @click.prevent="setSort('votes')" v-bind:class="{ active: isCurrentSort('votes'), asc: (isCurrentSort('votes') && !entrySortDesc) }">Upvotes</a></li>
            <li><a href="#" @click.prevent="setSort('comments')" v-bind:class="{ active: isCurrentSort('comments'), asc: (isCurrentSort('comments') && !entrySortDesc) }">Kommentare</a></li>
            <li><a href="#" @click.prevent="setSort('date')" v-bind:class="{ active: isCurrentSort('date'), asc: (isCurrentSort('date') && !entrySortDesc) }">Datum</a></li>
            <!-- <li><a href="#" @click.prevent="setSort('location')" v-bind:class="{ active: isCurrentSort('location'), disabled: !userCoords }">Distanz</a></li> -->
          </ul>
        </div>
      </div>
      <div class="col col--right">
        <ul class="list__entries">
          <li v-for="entry in displayEntries" class="list-entry" v-if="entries" v-bind:class="{ famed: entry.famed }" v-bind:key="entry._id">
            <router-link :to="'/entries/' + entry._id" class="list-entry__link">
              <span class="list-entry__image" :style="{ backgroundImage: 'url(' + entry.photo.small.url + ')' }"></span>
              <span class="list-entry__content">
                <h3>{{ entry.title }}</h3>
                <span class="list-entry__location">{{ entry.address }}</span>
                <span class="list-entry__meta list-entry__meta--votes">{{ entry.votes }}</span>
                <span class="list-entry__meta list-entry__meta--comments">{{ entry.commentCount }}</span>
                <span v-if="entry.distance" class="list-entry__distance">{{ entry.distance }}</span>
              </span>
            </router-link>
          </li>
        </ul>
        <a class="showmore" href="#" v-if="entryDisplayCapped && entries" @click.prevent="displayEntryCount += 10">Mehr Spots anzeigen</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list-view',
  metaInfo: {
    title: 'Spots — Bikeable'
  },
  props: [],
  computed: {
    entries() {
      return this.$store.state.entries;
    },
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userCoords() {
      return this.$store.state.userCoords;
    },
    sort() {
      return this.$store.state.sort;
    },
    entryDisplayCapped() {
      return (this.displayEntryCount < this.filteredEntries.length);
    },
    sortedEntries() {
      if(!this.entries) return [];

      if(this.entrySort == 'votes') {
        if(this.entrySortDesc) {
          return this.entries.sort(function(a,b) {
            return b.votes - a.votes;
          });
        }else{
          return this.entries.sort(function(a,b) {
            return a.votes - b.votes;
          });
        }
      }else if(this.entrySort == 'comments') {
        if(this.entrySortDesc) {
          return this.entries.sort(function(a,b) {
            return b.commentCount - a.commentCount;
          });
        }else{
          return this.entries.sort(function(a,b) {
            return a.commentCount - b.commentCount;
          });
        }
      }else if(this.entrySort == 'date') {
        if(this.entrySortDesc) {
          return this.entries.sort(function(a,b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
        }else{
          return this.entries.sort(function(a,b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        }
      }else{ 
        return this.entries;
      }
    },
    filteredEntries() {
      if(this.entryFilter == 'all') {
        return this.sortedEntries;
      }else if(this.entryFilter == 'shame') {
        return this.sortedEntries.filter(function(entry) {
          return !entry.famed;
        });
      }else if(this.entryFilter == 'fame') {
        return this.sortedEntries.filter(function(entry) {
          return entry.famed;
        });
      }
    },
    displayEntries() {
      return this.filteredEntries.slice(0, this.displayEntryCount);
    }
  },
  data() {
    return {
      entryFilter: 'all',
      entrySort: 'votes',
      entrySortDesc: true,
      displayEntryCount: 15,

      showFilter: false,
      showSort: false
    }
  },
  watch: {
    'entryFilter': function(to, from) {
      this.displayEntryCount = 15;
    }
  },
  methods: {
    setSort(sort) {
      // this.$store.dispatch('setEntrySorting', sort);

      if(this.entrySort == sort) {
        this.entrySortDesc = !this.entrySortDesc;
      }else{
        this.entrySort = sort;
        this.entrySortDesc = true;
      }
    },
    isCurrentFilter(filter) {
      return this.entryFilter == filter;
    },
    isCurrentSort(sort) {
      return this.entrySort == sort;
    }
  },
  mounted() {
    this.$store.dispatch('loadEntries');
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
    max-width: 1300px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    flex-wrap: wrap;

    .col {
      &--left {
        width: 100%;
        flex-shrink: 0;
        padding-right: 0;
        box-sizing: border-box;

        @include desktop() {
          width: 15rem;
          padding-right: 1.5rem;
        }
      }
      &--right {
        flex-shrink: 1;
        flex-grow: 1;
        width: 100%;

        @include desktop() {
          width: calc(100% - 15rem);
        }
      }
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
          background-color: #fff;
          display: block;
          text-decoration: none;
          color: #666;
          line-height: 2rem;
          padding: 0 1rem;
          margin-bottom: 5px;
          border: 2px solid #fff;
          position: relative;
          border-radius: 4px;
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
  .hero {
    margin-bottom: 1rem;
    position: relative;

    &__sort {
      margin: 1rem 0 0 0;
      display: flex;
      flex-wrap: wrap;

      li {
        display: block;
        margin-right: 5px;
        margin-bottom: 5px;
        width: 100%;

        @include desktop() {
          width: auto;
        }

        a {
          display: inline-block;
          text-transform: uppercase;
          padding: 0 1.5rem;
          background-color: #fff;
          border: 2px solid #fff;
          color: #aaa;
          text-decoration: none;
          font-size: .8rem;
          font-weight: 700;
          letter-spacing: .05rem;
          line-height: 2rem;

          @include desktop() {
            width: auto;
          }

          &.active {
            color: #333;
            pointer-events: none;
            border-color: #333;
            // border-bottom: 1px solid #333;
          }
          &.disabled {
            color: #bbb;
            pointer-events: none;
          }
          &:hover {
            color: #333;
          }
        }
      }

      @include desktop  {
        margin: 2rem 0 2rem 0;

        li {

          a {

          }
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
      margin-bottom: .5rem;
      // padding: 1.5rem 1rem;
      // transition: all .5s;

      // &:nth-child(2n) {
      //   background-color: #fff;
      // }
      &__distance {
        display: block;
        color: #888;
        margin-top: .25rem;
        font-size: .8rem;

        @include desktop() {
          font-size: 1rem;
        }
      }
      &__location {
        display: block;
        font-size: .8rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        margin-bottom: .5rem;
        font-family: $f-head;

        @include desktop() {
          font-size: .8rem;
        }
      }
      &__link {
        display: flex;
        align-items: center;
        width: 100%;
        margin: 0 auto;
        text-decoration: none;
        color: #333;
        background-color: #fafafa;
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
          background-color: #fff;

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

        &::after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: $c-highlight;
          opacity: .6;
          mix-blend-mode: color;
          transition: .2s opacity;
          // transition: .1s opacity;
        }

        @include desktop() {
          width: 6.5rem;
          height: 6.5rem;
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
        font-family: $f-head;
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
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: .2rem;
        color: #333;
        transition: .2s color;
        line-height: 1.1;

        @include desktop() {
          font-size: 1rem;
        }
      }

      &.famed {

        .list-entry__link::after {
          background-image: linear-gradient(90deg, rgba($c-main, .3) 0%, #fff 70%);
        }
        .list-entry__link:hover h3, .list-entry__link:focus h3 {
          color: $c-main;
        }
        .list-entry__link {
          border-color: $c-main;
        }
        .list-entry__image::after {
          background-color: $c-main;
        }
      }

    }
  }
  .showmore {
    display: block;
    text-align: center;
    margin-top: 2rem;
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
