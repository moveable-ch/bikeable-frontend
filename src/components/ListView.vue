<template>
  <div class="list">
    <div class="container">
      <div class="spot-nav clearfix">
        <router-link v-if="isLoggedIn" to="/add" class="spot-nav__add"></router-link>
      </div>
      <div class="hero">
        <p>Bikeable.ch zeigt die gefährlichsten Stellen für Velofahrer   auf und schlägt gleichzeitig Lösungen vor.</p>
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
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.list {
  margin: 1rem 0;
}

.hero {
  display: none;
  font-size: 1.5rem;
  // padding: 1rem;
  // border: 3px solid $c-main;
  // background-color: #fff;
  margin: 2rem 0;

  p {
    color: $c-main;
    font-weight: 500;
    max-width: 800px;
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
      align-items: center;
      width: 100%;
      text-decoration: none;
      color: #333;

      &:hover {
        h3 {
          color: $c-highlight;
        }
        .entry__image {
          &::before {
            opacity: .3;
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
      border-radius: 99%;
      position: relative;
      overflow: hidden;

      &::before, &::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      &::after {
        background-image: url('../assets/smile-bad-nobg.svg');
        background-size: 100%;
      }
      &::before {
        background-color: $c-highlight;
        opacity: .8;
        transition: .4s opacity;
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

      @include desktop() {
        font-size: 1.5rem;
      }
    }

    &.famed {

      .entry__link:hover h3 {
        color: $c-main;
      }
      .entry__image::before {
        background-color: $c-main;
      }
      .entry__image::after {
        background-image: url('../assets/smile-good-nobg.svg');
      }
      .entry__votes {
        color: $c-main;
      }
    }

  }
}

</style>
