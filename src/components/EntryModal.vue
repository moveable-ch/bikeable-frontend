<template>
  <transition v-bind:css="false" v-on:leave="leave" v-on:enter="enter">
    <div class="entry-modal" v-bind:class="{ 'is-famed': getFamed }" @click="$emit('close')">
      <transition v-bind:css="false" v-on:enter="enterInner">
        <div class="entry-modal__inner" v-if="currentEntry" @click.stop>
          <div
            class="entry-modal__image"
            v-bind:style="'background-image:url(' + currentEntry.photo.small.url + ')'">
          </div>
          <div class="entry-modal__content">
            <h3>{{ currentEntry.title }}</h3>
            <span class="address">{{ currentEntry.address }}</span>
            <div class="entry-modal__meta">
              <span class="entry-modal__meta__item entry-modal__meta__item--votes">{{ currentEntry.votes }}</span>
              <span class="entry-modal__meta__item entry-modal__meta__item--comments">{{ currentEntry.commentCount }}</span>
            </div>
          </div>
          <button class="btn-close" @click="$emit('close')">✕</button>
          <button class="btn-show" @click="showEntry">Spot anzeigen</button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import Velocity from 'velocity-animate';
import spots from '../api/spots';

export default {
  name: 'c-entry-modal',
  props: ['entryId', 'markerOffset'],
  data () {
    return {
      currentEntry: null
    }
  },
  computed: {
    getFamed() {
      if(!this.currentEntry) return false;
      if(!this.currentEntry.famed) return false;
      return true;
    },
    isEmbed() {
      return this.$route.query.embed;
    }
  },
  watch: {
    entryId (to, from) {
      this.loadEntry();
    }
  },
  mounted() {
    this.loadEntry();
  },
  methods: {
    showEntry() {
      if(this.isEmbed) {
        window.open(
          'https://bikeable.ch/entries/' + this.entryId,
          '_blank'
        );
      } else {
        this.$router.push({ name: 'entry', params: { id: this.entryId }});
      }
    },
    loadEntry() {
      this.$store.commit('LOAD_START');

      spots.getSpotById(this.entryId)
        .then((entry) => {
          this.currentEntry = entry;
          this.$store.commit('LOAD_FINISH');
        }, (response) => {
          this.$store.commit('LOAD_FINISH');
        });
    },
    enterInner(el, done) {
      Velocity(el,
        {
          opacity: [1, 0],
          translateX: [0, this.markerOffset.x+'px'],
          translateY: [0, this.markerOffset.y+'px'],
          scale: [1, .1]
        },
        {
          duration: 600,
          complete: function () {
            done();
          },
          easing: 'easeOutQuint'
        }
      );
    },
    enter(el, done) {
      Velocity(el,
        {
          opacity: [1, 0]
        },
        {
          duration: 400,
          complete: function () {
            done();
          },
        }
      );
    },
    leave(el, done) {
      let inner = el.querySelector('.entry-modal__inner');
      Velocity(el,
        {
          opacity: [0, 1]
        },
        {
          duration: 600,
          complete: function () {
            done();
          },
        }
      );

      Velocity(inner,
        {
          opacity: [0, 1],
          translateX: [this.markerOffset.x+'px', 0],
          translateY: [this.markerOffset.y+'px', 0],
          scale: [.1, 1]
        },
        {
          duration: 400,
          easing: 'easeInSine'
        }
      );
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.entry-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, .6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  &__content {
    overflow: hidden;
    width: calc(100% - 5rem);
    padding: .5rem 1rem;
  }
  &__image {
    width: 5rem;
    height: 6rem;
    background-color: #f0f0f0;
    background-size: cover;
    background-position: center;
    flex-shrink: 0;

    @include tablet() {
      width: 9rem;
      height: 9rem;
    }
  }
  &__meta {
    margin-top: .5rem;
    &__item {
      position: relative;
      display: inline-block;
      padding-left: 24px;
      margin-right: 1rem;
      font-size: .8rem;
      line-height: 18px;

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
        @include retina {
          background-image: url('../assets/upvote-small@2x.png');
        }
      }
      &--comments {
        padding-left: 26px;
      }
      &--comments::before {
        background-image: url('../assets/comment-small.png');
        @include retina {
          background-image: url('../assets/comment-small@2x.png');
        }
      }
    }
  }

  &__inner {
    padding: 4px;
    background-color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 1rem;
    width: 90%;
    max-width: 30rem;
    position: relative;
    padding-bottom: 3.5rem;
    display: flex;
    align-items: center;
    border-radius: 4px;
    // box-shadow: 4px 4px 0 0 rgba($c-highlight, 1);
    border: 2px solid $c-highlight;

    .is-famed & {
      border-color: $c-main;
      // box-shadow: 4px 4px 0 0 rgba($c-main, 1);
    }

    .upvotes {
      display: none;
      border: 2px solid $c-highlight;
      color: $c-highlight;
      width: 2.5rem;
      height: 2.5rem;
      line-height: 2.5rem;
      text-align: center;
      border-radius: 99%;
      flex-shrink: 0;
      margin-right: 1rem;
      position: relative;
      z-index: 1;

      .is-famed & {
        color: $c-main;
        border-color: $c-main;
      }
    }
    h3 {
      margin-bottom: 0;
      color: $c-black;
    }
    .address {
      font-size: .8rem;
      color: #888;
      margin-top: .5rem;
      display: block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.2;
    }
    .meta {
      line-height: 1.6;
      font-size: .8rem;
      color: #888;
    }
    .btn-close {
      font-size: 1rem;
      font-weight: bold;
      padding: 0;
      background: none;
      border: none;
      position: absolute;
      top: 0;
      right: 0;
      background-color: #fff;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      z-index: 0;
      cursor: pointer;

      &:active, &:focus {
        outline: none;
        color: $c-main;
      }
      &:hover {
        color: $c-main;
      }
    }
    .btn-show {
      background: none;
      border: none;
      padding: 0;
      position: absolute;
      bottom: 4px;
      left: 4px;
      border-radius: 4px;
      width: calc(100% - 8px);
      height: 3rem;
      line-height: 3rem;
      background-color: $c-highlight;
      color: #fff;
      font-family: $f-body;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;

      &:active, &:focus {
        outline: none;
      }

      .is-famed & {
        background-color: $c-main;
      }
      &:hover {
        background-color: #333;
      }

      @include tablet() {

      }
    }
  }
}

// .modal-enter-active, .modal-leave-active {
//   transition: .5s opacity;
// }
// .modal-enter, .modal-leave-to {
//   opacity: 0;
// }
// .modal-leave-to {
  // .entry-modal__inner {
  //   transition: .3s transform $easeInQuint;
  //   transform: scale(.8);
  // }
// }

// .modal_inner-enter-active, .modal_inner-leave-active {
//   transition: .4s transform $easeOutQuint;
// }
// .modal_inner-enter, .modal_inner-leave-to {
//   transform: scale(.8);
// }

</style>
