<template>
  <div class="list">
    <div class="container">
      <div class="hero">
        <router-link v-if="isLoggedIn" to="/add" href="" class="hero__addlink">🚲 Spot hinzufügen</router-link>
        <ul class="hero__sort">
          <li><a href="#" @click.prevent="setSort('shame')" v-bind:class="{ active: isCurrentSort('shame') }">wall of shame</a></li>
          <li><a href="#" @click.prevent="setSort('fame')" v-bind:class="{ active: isCurrentSort('fame') }">hall of fame</a></li>
          <li><a href="#" @click.prevent="setSort('location')" v-bind:class="{ active: isCurrentSort('location'), disabled: !userCoords }">closest spots</a></li>
        </ul>
      </div>
      <ul>
        <li v-for="entry in entries" class="entry" v-bind:class="{ famed: entry.famed }">
          <router-link :to="'/entries/' + entry._id" class="entry__link">
            <span class="entry__votes">{{ entry.votes }}</span>
            <span class="entry__image" :style="{ backgroundImage: 'url('+entry.photo.small+')' }"></span>
            <span class="entry__content">
              <h3>{{ entry.title }}</h3>
              <span class="entry__location">{{ entry.address }}</span>
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
      return this.$store.state.userCoords
    },
    sort() {
      return this.$store.state.sort
    }
  },
  data() {
    return {}
  },
  watch: {
  },
  methods: {
    setSort(sort) {
      this.$store.dispatch('setEntrySorting', sort);
    },
    isCurrentSort(sort) {
      return this.sort == sort;
    }
  },
  mounted() { 
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.list {
  margin: 3rem 0;
}

.hero {
  margin-bottom: 3rem;

  &__sort {
    margin-top: 2rem;
    height: 3rem;
    display: flex;
    align-items: flex-end;

    li {
      display: inline-block;
      margin-right: 1rem;

      a {
        text-decoration: none;
        font-size: 1.25rem;
        transition: font-size .3s $easeInOutQuint;

        &.active {
          color: $c-main;
          font-size: 2.5rem;
          pointer-events: none;
        }
        &.disabled {
          color: #aaa;
          pointer-events: none;
        }
      }
    }
  }
  &__addlink {
    display: block;
    padding: 1rem;
    box-sizing: border-box;
    text-align: center;
    text-decoration: none;
    font-size: 1.25rem;
    width: 20rem;
    background-color: #fff;
    border: 2px solid $c-main;
    color: $c-main;

    &:hover {
      background-color: $c-main;
      color: #fff;
    }
  }
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  .entry {
    margin-bottom: 1rem;

    &__link {
      display: flex;
      align-items: top;
      width: 100%;
      text-decoration: none;
      color: #333;

      &:hover {
        h3 {
          text-decoration: underline;
        }
        .entry__image {
          &::after {
            opacity: 0;
          }
        }
      }
    }
    &__content {
      flex-shrink: 1;
    }
    &__image {
      flex-shrink: 0;
      display: block;
      width: 3rem;
      height: 3rem;
      background-size: cover;
      background-position: center;
      margin: 0 1rem;
      // border-radius: 99%;
      position: relative;
      overflow: hidden;

      // &::before, &::after {
      //   content: "";
      //   display: block;
      //   width: 100%;
      //   height: 100%;
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   transition: .4s opacity, .4s transform;
      // }
      // &::after {
      //   background-image: url('../assets/smile-bad-nobg.svg');
      //   background-size: 100%;
      // }
      // &::before {
      //   background-color: $c-highlight;
      //   opacity: .8;
      // }

      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: $c-highlight;
        opacity: .4;
        mix-blend-mode: overlay;
        // transition: .1s opacity;
      }

      @include desktop() {
        width: 6rem;
        height: 6rem;
      }
    }
    &__votes {
      color: $c-highlight;
      font-size: 1.5rem;
    }
    h3 {
      font-size: 1.25rem;
      font-weight: 400;
      margin-bottom: .2rem;
      color: $c-highlight;

      @include desktop() {
        font-size: 1.5rem;
      }
    }

    &.famed {

      .entry__link h3 {
        color: $c-main;
      }
      .entry__image::before {
        background-color: $c-main;
      }
      .entry__image::after {
        background-color: $c-main;
        // background-image: url('../assets/smile-good-nobg.svg');
      }
      .entry__votes {
        color: $c-main;
      }
    }

  }
}

</style>
