<template>
  <div class="entry-media">
    <div class="entry-media__image">
      <img v-if="entry.photo" :src="entry.photo.large.url">
      <img v-if="entry.gallery && entry.gallery[0]" :src="entry.gallery[0].photo.large.url">
    </div>
  </div>
</template>

<script>

export default {
  name: 'c-entry-media',
  props: ['entry', 'userData', 'hasVoted', 'isLoggedIn'],
  components: {
  },
  data () {
    return {
    }
  },

  computed: {
  },

  watch: {
  },

  mounted() {
  },

  methods: {
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.entry-media {
  margin-bottom: 2rem;
  margin-top: -.5rem;
  position: relative;
  display: block;
  width: 100%;
  height: 16rem;

  &__image {
    width: auto;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    background-color: rgba($c-blue, .5);

    img {
      display: block;
      width: auto;
      height: auto;
      max-height: 100%;
      max-width: 100%;
      margin: 0 auto;
    }
  }

  @include tablet {
    height: 28rem;
    margin-bottom: 2rem;
  }
}

</style>
