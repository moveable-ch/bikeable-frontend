<template>
  <div class="list">
    <div class="container">
      <div class="hero">
        <router-link v-if="isLoggedIn" to="/add" href="" class="hero__addlink">Spot hinzufügen</router-link>
        <ul class="hero__sort">
          <li><a href="#" @click.prevent="entryFilter = 'all'" v-bind:class="{ active: isCurrentSort('all') }">Alle Spots</a></li>
          <li><a href="#" @click.prevent="entryFilter = 'shame'" v-bind:class="{ active: isCurrentSort('shame') }">Wall of Shame</a></li>
          <li><a href="#" @click.prevent="entryFilter = 'fame'" v-bind:class="{ active: isCurrentSort('fame') }">Hall of Fame</a></li>
          <!-- <li><a href="#" @click.prevent="setSort('location')" v-bind:class="{ active: isCurrentSort('location'), disabled: !userCoords }">Closest Spots</a></li> -->
        </ul>
      </div>
    </div>
    <div class="list__container">
      <ul>
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
    sortedEntries() {
      if(!this.entries) return [];

      return this.entries.sort(function(a,b) {
        return b.votes - a.votes;
      });
    },
    displayEntries() {
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
    }
  },
  data() {
    return {
      entryFilter: 'all',
      entrySort: 'votes',
      entrySortDir: 'asc'
    }
  },
  watch: {

  },
  methods: {
    setSort(sort) {
      this.$store.dispatch('setEntrySorting', sort);
    },
    isCurrentSort(filter) {
      return this.entryFilter == filter;
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
    padding: 0rem 0 4rem 0;
  }

  &__container {
    // max-width: 1100px;
    margin: 0 auto;
  }
  .hero {
    margin-bottom: 1rem;
    position: relative;

    &__sort {
      margin: 1rem 0 0 0;

      li {
        display: inline;
        margin-right: .2rem;
        // width: 100%;
        line-height: 1.3;

        a {
          color: #777;
          text-decoration: none;
          font-size: 1rem;
          transition: font-size .3s $easeInOutQuint;

          &.active {
            color: #333;
            font-size: 1rem;
            pointer-events: none;
            border-bottom: 1px solid #333;
          }
          &.disabled {
            color: #bbb;
            pointer-events: none;
          }
        }
      }

      @include desktop  {
        margin: 3rem 0 2rem 0;

        li {
          display: inline;
          margin-right: 1rem;

          a {

          }
        }
      }
    }
    &__addlink {
      display: block;
      height: 2.5rem;
      line-height: 2.5rem;
      // box-sizing: border-box;
      text-align: center;
      text-decoration: none;
      font-size: .8rem;
      text-transform: uppercase;
      letter-spacing: .05rem;
      width: 100%;
      max-width: 400px;
      background-color: transparent;
      color: #333;
      border: 2px solid #333;
      font-weight: 700;
      margin: 0 auto;
      position: relative;
      margin-top: .5rem;
      margin-bottom: 1.5rem;

      &:hover {
        border-color: $c-main;
        color: $c-main;
      }

      @include desktop {
        background-color: #fff;
        max-width: none;
        width: 240px;
        position: absolute;
        top: -1.25rem;
        right: 0;
      }
    }
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

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
        max-width: 1100px;
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
