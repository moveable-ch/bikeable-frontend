<template>
  <div class="list">
    <div class="spot-nav clearfix">
      <router-link v-if="isLoggedIn" to="/add" class="spot-nav__add"></router-link>
      <router-link to="/map" class="spot-nav__link">Zur Karte</router-link>
    </div>
    <div class="hero">
      <p>Bikeable.ch zeigt die gefährlichsten Stellen für Velofahrer*innen auf und schlägt gleichzeitig Lösungen vor.</p>
    </div>
    <ul>
      <li v-for="entry in entries" class="entry">
        <span class="entry__votes">{{ entry.votes }}</span>
        <router-link :to="'/entries/' + entry._id" class="entry__image" :style="{ backgroundImage: 'url('+entry.photo.small+')' }">
          <img :src="entry.photo.small">
        </router-link>
        <div class="entry__content">
          <router-link :to="'/entries/' + entry._id">{{ entry.title }}</router-link><br>
          <span class="entry__location">{{ entry.address }}</span>
        </div>
      </li>
    </ul>
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
  max-width: 800px;
  margin: 1rem 0;
  padding: 0 1rem;
  padding-left: 2rem;
}

.hero {
  font-size: 1.25rem;
  padding: 1rem;
  border: 4px solid $c-main;
  background-color: #fff;
  margin: 2rem 0;

  p {
    color: $c-main;
    font-weight: 700;
    max-width: none;
  }
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  .entry {
    margin-bottom: .5rem;
    background-color: #fff;
    padding: .5rem;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;

    &__votes {
      width: 2rem;
      height: 2rem;
      background-color: $c-main;
      border-radius: 99%;
      color: #fff;
      line-height: 2rem;
      margin-right: -1rem;
      margin-left: calc(-1rem - 4px);
      font-weight: 700;
      text-align: center;
      position: relative;
      z-index: 1;
      border: 2px solid #fff;
    }

    &__image {
      display: block;
      width: 4rem;
      height: 4rem;
      background-size: cover;
      background-position: center;

      img {
        display: none;
      }

      @include desktop() {
        width: 5rem;
        height: 5rem;
      }
    }

    &__content {
      margin-left: 1rem;

      @include desktop() {
        margin-left: 1rem;
      }

      a {
        text-decoration: none;
        color: #000;
        margin-bottom: 1rem;
        font-size: 1rem;
        font-weight: 700;
        font-family: $f-body;
        border-bottom: 1px solid $c-highlight;
        line-height: 1.4;

        &:hover {
          color: $c-highlight;
          border-color: $c-highlight;
        }
      }
      .entry__location {
        font-size: .75rem;
        display: block;
        margin-top: .5rem;
      }
      p {
        font-size: .9rem;

        @include desktop() {
          margin-top: .5rem;
          font-size: 1rem;
        }
      }
    }

  }
}

</style>
