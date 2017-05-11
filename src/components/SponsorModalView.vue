<template>
  <transition name="modal">
    <div class="sponsor-modal" @click="$emit('close')">
      <div class="sponsor-modal__inner" v-if="sponsoredEntry" @click.stop>
        <div class="sponsor-modal__content">
          <h2>{{ sponsoredEntry.name }}</h2>
          <span class="address">{{ sponsoredEntry.address }}</span><br>
          <a v-if="sponsoredEntry.website" :href="sponsoredEntry.website" target="_blank" class="link">Website</a>
          <button class="btn-close" @click="$emit('close')">✕</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'sponsor-modal-view',
  props: ['sponsoredEntry'],
  data () {
    return {
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    showEntry() {
      // this.$router.push({ name: 'entry', params: { id: this.entryId }});
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.sponsor-modal {
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

  &__inner {
    padding: 1.5rem 2.5rem;
    background-color: #fff;
    display: flex;
    max-width: calc(100% - 2rem);
    margin: 0 1rem;
    position: relative;

    h2 {
      font-size: 1rem;
      z-index: 1;
      position: relative;
      margin-bottom: .25rem;
    }
    .address {
      font-size: .8rem;
      color: #888;
    }
    .link {
      font-size: .8rem;
    }
    .btn-close {
      font-size: 1rem;
      padding: 0;
      background: none;
      border: none;
      position: absolute;
      top: -.5rem;
      left: -.5rem;
      background-color: #fff;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
      z-index: 0;

      &:active, &:focus {
        outline: none;
        color: $c-main;
      }
    }
    .btn-show {
      background: none;
      border: 1px solid $c-highlight;
      padding: .25rem .5rem;
      margin-top: .5rem;
      font-family: $f-body;
      font-size: .8rem;
      color: $c-highlight;
      cursor: pointer;

      &:active, &:focus {
        outline: none;
      }

      .is-famed & {
        color: $c-main;
        border-color: $c-main;
      }
    }
  }
}

.modal-enter-active, .modal-leave-active {
  transition: .4s opacity;

  .sponsor-modal__inner {
    transition: .4s transform $easeOutQuint;
  }
}
.modal-enter, .modal-leave-to {
  opacity: 0;

  .sponsor-modal__inner {
    transform: scale(.8);
  }
}

</style>
