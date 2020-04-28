<template>
  <div class="entry-media">
    <div class="entry-media__carousel" ref="carousel">
      <div class="carousel-cell" v-for="image in entry.gallery" v-bind:key="image.imageId">
        <img v-bind:src="image.photo.large">
      </div>
      <div class="carousel-cell" v-if="entry.gallery.length == 0">
        <img :src="entry.photo.large.url">
      </div>
    </div>
  </div>
</template>

<script>

import Flickity from 'flickity';
import 'flickity-imagesloaded';

export default {
  name: 'c-entry-media',
  props: ['entry', 'userData', 'hasVoted', 'isLoggedIn'],
  components: {
  },
  data () {
    return {
      flkty: null
    }
  },

  computed: {
  },

  watch: {
    entry: function(e) {
      if(e.gallery.length > 0) {
        this.initCarousel();
      }
    }
  },

  mounted() {
    this.initCarousel();
  },

  methods: {
    initCarousel() {
      if(this.entry.gallery.length == 0) return;
      if(this.flkty) this.flkty.destroy();
      this.$nextTick(function() {
        this.flkty = new Flickity(this.$refs.carousel, {
          imagesLoaded: true,
          prevNextButtons: false
        });
      });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.entry-media {
  margin-bottom: 4rem;
  margin-top: -.5rem;
  position: relative;
  display: block;
  width: 100%;
  height: 13rem;

  &__carousel {
    // height: 100%;
    // width: 100%;
    // overflow: hidden;

    .carousel-cell {
      display: block;
      width: auto;
      height: 13rem;
      margin-right: 10px;
      margin-bottom: .5rem;

      img {
        width: auto;
        height: 100%;
      }

      @include tablet {
        height: 22rem;
        margin-bottom: 1rem;
      }
      @include desktop {
        height: 28rem;
      }
    }
  }
  /*.carousel-cell {
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
  }*/
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
    height: 22rem;
    margin-bottom: 6rem;
  }
  @include desktop {
    height: 28rem;
  }
}

</style>
