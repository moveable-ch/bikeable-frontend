<template>
  <div class="list">
    <div class="list__container">
      <div class="col col--left">
        <router-link v-if="isLoggedIn" to="/add" class="addlink">Spot hinzufügen</router-link>
        <div class="filter-item filter-item--filter" v-bind:class="{ visible: showFilter }">
          <h3 @click="showFilter = !showFilter">Filter</h3>
          <ul class="filter-item__list">
          <li><a href="#" @click.prevent="entryFilter = 'all'" v-bind:class="{ active: isCurrentFilter('all') }">Alle Spots</a></li>
          <li><a href="#" @click.prevent="entryFilter = 'shame'" v-bind:class="{ active: isCurrentFilter('shame') }">☹ Wall of Shame</a></li>
          <li><a href="#" @click.prevent="entryFilter = 'fame'" v-bind:class="{ active: isCurrentFilter('fame') }">☺ Hall of Fame</a></li>
          </ul>
        </div>
        <div class="filter-item filter-item--sort" v-bind:class="{ visible: showSort }">
          <h3 @click="showSort = !showSort">Sortierung</h3>
          <ul class="filter-item__list">
            <li><a href="#" @click.prevent="setSort('votes')" v-bind:class="{ active: isCurrentSort('votes'), asc: (isCurrentSort('votes') && !entrySortDesc) }">Upvotes</a></li>
            <li><a href="#" @click.prevent="setSort('comments')" v-bind:class="{ active: isCurrentSort('comments'), asc: (isCurrentSort('comments') && !entrySortDesc) }">Kommentare</a></li>
            <!-- <li><a href="#" @click.prevent="setSort('location')" v-bind:class="{ active: isCurrentSort('location'), disabled: !userCoords }">Distanz</a></li> -->
          </ul>
        </div>
      </div>
      <div class="col col--right">
        <ul class="list__entries">
          <li v-for="entry in displayEntries" class="list-entry" v-if="entries" v-bind:class="{ famed: entry.famed }" v-bind:key="entry._id">
            <router-link :to="'/entries/' + entry._id" class="list-entry__link">
              <span class="list-entry__image" :style="{ backgroundImage: 'url(' + entry.photo.small + ')' }"></span>
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
    // text-transform: uppercase;
    // letter-spacing: .05rem;
    width: 100%;
    max-width: 400px;
    background-color: $c-main;
    color: #fff;
    font-weight: 500;
    margin: 0 auto;
    margin-bottom: 1.5rem;
    border-radius: 4px;

    &:hover {
      background-color: #333;
    }
  }
  .filter-item {
    margin-bottom: 5px;
    height: 1.5rem;
    overflow: hidden;

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
      margin-bottom: 5px;
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
        padding: 1rem;
        box-sizing: border-box;
        border-left: 4px solid $c-highlight;

        &:hover, &:focus {
          background-color: #fff;

          h3 {
            color: $c-highlight;
            // text-decoration: underline;
          }
        }

        @include desktop() {
          // padding-left: .5rem;
        }
      }
      &__content {
        flex-shrink: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &__image {
        flex-shrink: 0;
        display: block;
        width: 4rem;
        height: 4rem;
        background-size: cover;
        background-position: center;
        margin: 0 1rem 0 0;
        position: relative;
        overflow: hidden;

        &::after {
          content: "";
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: $c-highlight;
          opacity: 0;
          mix-blend-mode: overlay;
          // transition: .1s opacity;
        }

        @include desktop() {
          width: 4rem;
          height: 4rem;
          margin: 0 1rem 0 0;
        }
      }
      &__meta {
        position: relative;
        display: inline-block;
        padding-left: 24px;
        margin-right: 1rem;

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
          background-image: url('../assets/upvote-small.png');
        }
        &--comments {
          padding-left: 26px;
        }
        &--comments::before {
          background-image: url('../assets/comment-small.png');
        }
      }
      h3 {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: .2rem;
        color: #333;

        @include desktop() {
          font-size: 1rem;
        }
      }

      &.famed {

        .list-entry__link:hover h3, .list-entry__link:focus h3 {
          color: $c-main;
        }
        .list-entry__link {
          border-color: $c-main;
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
