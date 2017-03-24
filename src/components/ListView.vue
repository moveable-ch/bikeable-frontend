<template>
  <div class="list">
    <div class="spot-nav clearfix">
      <router-link to="/add" class="spot-nav__add"></router-link>
      <router-link to="/map" class="spot-nav__link">Zur Karte</router-link>
    </div>
    <ul>
      <li v-for="entry in entries" class="entry">
        <router-link :to="'/entry/' + entry._id" class="entry__image" :style="{ backgroundImage: 'url('+entry.image+')' }">
          <img :src="entry.image">
        </router-link>
        <div class="entry__content">
          <router-link :to="'/entry/' + entry._id">{{ entry.title }}</router-link>
          <p>{{ entry.text }}</p>
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
      return this.$store.state.entries
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.list {
  max-width: 700px;
  margin: 1rem 0;
  padding: 0 1rem;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  .entry {
    margin-bottom: .5rem;

    &::after {
      content: "";
      display: block;
      clear: both;
      margin-bottom: 1rem;
    }

    &__image {
      display: block;
      width: 4rem;
      height: 4rem;
      background-size: cover;
      background-position: center;
      float: left;

      img {
        display: none;
      }

      @include desktop() {
        width: 7rem;
        height: 7rem;
      }
    }

    &__content {
      float: left;
      width: calc(100% - 5rem);
      margin-left: 1rem;

      @include desktop() {
        margin-left: 1.5rem;
        width: calc(100% - 9rem);
      }

      a {
        display: inline;
        text-decoration: none;
        color: #000;
        margin-bottom: .5rem;
        font-size: 1.2rem;
        font-weight: normal;
        font-family: $f-body;
        border-bottom: 1px solid $c-blue;
        line-height: 1.4;

        &:hover {
          color: $c-blue;
        }
      }
      p {
        margin-top: .5rem;
        font-size: .9rem;

        @include desktop() {
          margin-top: 1rem;
          font-size: 1rem;
        }
      }
    }

  }
}

</style>
