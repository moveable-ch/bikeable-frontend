<template>
  <transition name="modal">
    <div class="entry-modal" v-bind:class="{ 'is-famed': getFamed }" @click="$emit('close')">
      <div class="entry-modal__inner" v-if="currentEntry" @click.stop>
        <span class="upvotes">{{ currentEntry.votes }}</span>
        <div class="entry-modal__content">
          <h2>{{ currentEntry.title }}</h2>
          <span class="address">{{ currentEntry.address }}</span>
          <div class="meta">{{ currentEntry.commentCount }} Kommentare</div>
          <button class="btn-close" @click="$emit('close')">✕</button>
          <button class="btn-show" @click="showEntry">Spot anzeigen</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
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
      this.$router.push({ name: 'entry', params: { id: this.entryId }});
    },
    loadEntry() {
      this.$store.commit('LOAD_START');

      this.$http.get('https://backend.bikeable.ch/api/v1/entries/'+this.entryId).then(response => {
        this.currentEntry = response.body.data;
        this.$store.commit('LOAD_FINISH');
      }, response => {
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
    width: 100%;
  }

  &__inner {
    padding: 1.5rem;
    background-color: #fff;
    // display: flex;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 1rem;
    width: 90%;
    max-width: 30rem;
    position: relative;
    padding-bottom: 4.5rem;

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
  transition: .4s opacity;

  .entry-modal__inner {
    transition: .4s transform $easeOutQuint;
  }
}
.modal-enter, .modal-leave-to {
  opacity: 0;

  .entry-modal__inner {
    transform: scale(.8);
  }
}

</style>
