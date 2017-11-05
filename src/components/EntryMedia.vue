<template>
  <div class="entry-media" v-bind:class="{ 'is-expanded': isExpanded }">
    <div class="entry-media__viewer">
      <div
        v-bind:class="{ visible: !showMap }"
        v-bind:style="'background-image: url(' + img + ')'"
        class="entry-media__image">
      </div>
      <div v-bind:class="{ visible: showMap }" class="entry-media__map">
        <div class="gmaps" id="gmaps" ref="gmaps"></div>
      </div>
    </div>
    <div class="controls">
      <a
        class="controls__btn controls__btn--view"
        @click.prevent="showMap = !showMap"
        v-bind:class="{ active: showMap }"
        title="Ansicht wechseln"
        href="#">
        <span class="sr-only">Switch View</span>
      </a>
      <a
        class="controls__btn controls__btn--expand"
        @click.prevent="isExpanded = !isExpanded"
        v-bind:class="{ active: isExpanded }"
        title="Vollbild"
        href="#">
        <span class="sr-only">Fullscreen</span>
      </a>
      <div class="share">
        <a class="share__button share__button--fb" target="_blank" :href="'https://www.facebook.com/sharer/sharer.php?u=' + entryUrl"></a>
        <a class="share__button share__button--twitter" target="_blank" :href="'https://twitter.com/home?status=' + entryUrl"></a>
        <a class="share__button share__button--mail" :href="'mailto:?subject=' + title + '&body=' + entryUrl"></a>
      </div>
    </div>
  </div>
</template>

<script>

import mapstyle from '@/assets/gmaps.json';
import GoogleMapsLoader from 'google-maps';

export default {
  name: 'c-entry-media',
  props: ['img', 'coords', 'entryUrl', 'title'],
  components: {
  },
  data () {
    return {
      showMap: false,
      isExpanded: false
    }
  },

  computed: {
  },

  watch: {
    'isExpanded': function(to, from) {
      setTimeout(() => {
        google.maps.event.trigger(this.map, 'resize');
      }, 200);
      if(to) {
        document.body.style.overflow = 'hidden';
      }else{
        document.body.style.overflow = 'auto';
      }
    }
  },

  mounted() {
    this.initMap();
  },

  methods: {

    initMap() {
      GoogleMapsLoader.KEY = 'AIzaSyD5iWyE6nsYCAhyRnL58aFFoFhAI9rcwBI';
      GoogleMapsLoader.LANGUAGE = 'de';

      GoogleMapsLoader.load(function(google) {
        this.google = google;

        this.map = new google.maps.Map(this.$refs.gmaps, {
          center: this.coords,
          zoom: 15,
          disableDefaultUI: false,
          clickableIcons: false,
          gestureHandling: 'greedy',
          styles: mapstyle,
          scrollwheel: false,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
          fullscreenControl: false
        });

        this.addMarker();

      }.bind(this));
    },

    addMarker() {
      this.marker = new this.google.maps.Marker({
        position: this.coords,
        map: this.map,
        draggable: true
      });
    }

  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.entry-media {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  background-color: #fff;
  overflow: hidden;
  z-index: 2;
  transition: .1s height $easeOutQuint, .1s width $easeOutQuint, .1s top, .1s left;

  @include desktop() {
    border: 1px solid $c-grey-dark;
    border-radius: 4px;
  }

  &.is-expanded {
    height: calc(100vh - 3rem);
    width: 100vw;
    position: fixed;
    z-index: 5;
    top: 3rem;
    left: 0;
    margin: 0;
    border: none;

    .entry-media__viewer {
      height: calc(100% - 45px);
    }

    @include desktop() {
      top: 5rem;
      height: calc(100vh - 5rem);
    }
  }

  .is-famed & {
    // border-color: $c-main;
  }

  &__viewer {
    position: relative;
    width: 100%;
    height: 15rem;

    @include desktop {
      height: 25rem;
    }
  }

  .controls {
    position: relative;
    display: flex;
    background-color: $c-grey;
    border-top: 1px solid $c-grey-dark;

    &__btn {
      display: block;
      width: 45px;
      height: 45px;
      // background-color: $c-black;
      // border: 1px solid darken($c-black, 25%);
      // border-radius: 4px;
      background-size: 40px;
      background-repeat: no-repeat;
      background-position: center;
      // margin-left: 4px;

      &:hover {
        background-color: #fff;
      }

      &--view {
        background-image: url('../assets/mapbutton.png');
        @include retina {
          background-image: url('../assets/mapbutton@2x.png');
        }

        &.active {
          background-image: url('../assets/imagebutton.png');
          @include retina {
            background-image: url('../assets/imagebutton@2x.png');
          }
        }
      }
      &--expand {
        background-image: url('../assets/expandbutton.png');
        @include retina {
          background-image: url('../assets/expandbutton@2x.png');
        }

        &.active {
          background-image: url('../assets/collapsebutton.png');
          @include retina {
            background-image: url('../assets/collapsebutton@2x.png');
          }
        }
      }
    }
  }
  .expand-btn {
    position: absolute;
    bottom: 0;
    right: 42px;
    z-index: 1;
    width: 40px;
    height: 40px;
    background-color: $c-main;
  }
  .switch-btn {
    display: block;
    width: 40px;
    height: 40px;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 1;
    background-color: $c-highlight;
    background-image: url('../assets/mapbutton.png');
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;

    @include retina {
      background-image: url('../assets/mapbutton@2x.png');
    }

    &.active {
      background-image: url('../assets/imagebutton.png');

      @include retina {
        background-image: url('../assets/imagebutton@2x.png');
      }
    }

    .is-famed & {
      background-color: $c-main;
    }
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  &__map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(101%);
    transition: .5s transform $easeOutQuint;

    &.visible {
      transform: translateX(0);
    }

    .gmaps {
      height: 100%;
      width: 100%;
    }
  }

  .share {
    // display: none;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 0;
    top: 0;

    @include desktop() {
    }

    &__button {
      display: block;
      width: 45px;
      height: 45px;
      background-size: 40px;
      background-position: center;

      &--fb {
        background-image: url('../assets/share-fb.png');
        @include retina {
          background-image: url('../assets/share-fb@2x.png');
        }
      }
      &--twitter {
        background-image: url('../assets/share-twitter.png');
        @include retina {
          background-image: url('../assets/share-twitter@2x.png');
        }
      }
      &--mail {
        background-image: url('../assets/share-mail.png');
        @include retina {
          background-image: url('../assets/share-mail@2x.png');
        }
      }

      &:hover {
        background-color: #fff;
      }

    }
  }
}

</style>
