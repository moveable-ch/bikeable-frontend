<template>
  <transition name="modal">
    <div class="entry-modal" v-bind:class="{ 'is-famed': getFamed }" @click="$emit('close')">
      <transition name="modal_inner">
        <div class="entry-modal__inner" v-if="currentEntry" @click.stop>
          <div
            class="entry-modal__image"
            v-bind:style="'background-image:url(' + currentEntry.photo.small.url + ')'">
          </div>
          <div class="entry-modal__content">
            <h2>{{ currentEntry.title }}</h2>
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
import spots from '../api/spots';

export default {
  name: 'entry-modal-view',
  props: ['entryId'],
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
          'https://beta.bikeable.ch/entries/' + this.entryId,
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
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.entry-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#333, .8);
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

    @include desktop() {
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
      }
      &--comments {
        padding-left: 26px;
      }
      &--comments::before {
        background-image: url('../assets/comment-small.png');
      }
    }
  }

  &__inner {
    padding: .5rem;
    background-color: #fff;
    // display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 1rem;
    width: 90%;
    max-width: 30rem;
    position: relative;
    padding-bottom: 3.5rem;
    display: flex;
    align-items: center;

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
    h2 {
      font-family: $f-body;
      text-transform: none;
      font-size: 1rem;
      z-index: 1;
      position: relative;
      margin-bottom: .25rem;
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
    }
    .btn-show {
      background: none;
      border: none;
      padding: 0;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3rem;
      line-height: 3rem;
      background-color: $c-highlight;
      color: #fff;
      font-family: $f-body;
      font-weight: bold;
      font-size: 1rem;
      cursor: pointer;
      transition: .2s background-color;

      &:active, &:focus {
        outline: none;
      }

      .is-famed & {
        background-color: $c-main;
      }
      &:hover {
        background-color: #333;
      }

      @include desktop() {

      }
    }
  }
}

.modal-enter-active, .modal-leave-active {
  transition: .5s opacity;
}
.modal-enter, .modal-leave-to {
  opacity: 0;
}
.modal-leave-to {
  .entry-modal__inner {
    transition: .3s transform $easeInQuint;
    transform: scale(.8);
  }
}

.modal_inner-enter-active, .modal_inner-leave-active {
  transition: .4s transform $easeOutQuint;
}
.modal_inner-enter, .modal_inner-leave-to {
  transform: scale(.8);
}

</style>
