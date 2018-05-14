<template>
  <transition name="modal">
    <div class="sponsor-modal" @click="$emit('close')">
      <div class="sponsor-modal__inner" v-if="sponsoredEntry" @click.stop>
        <div class="sponsor-modal__content">
          <img v-if="sponsoredEntry.logo" class="sponsor-modal__image" :src="sponsoredEntry.logo" alt="">
          <h3>{{ sponsoredEntry.name }}</h3>
          <p v-if="sponsoredEntry.text">{{ sponsoredEntry.text }}</p>
          <span class="address">{{ sponsoredEntry.address }}, {{ sponsoredEntry.stadt }}</span>
          <a v-if="sponsoredEntry.website" :href="sponsoredEntry.website" target="_blank" class="link">Website</a>
          <p class="sponsor-modal__notice" v-if="sponsoredEntry.isSponsor">{{ sponsoredEntry.name }} unterstützt Bikeable mit einem Sponsorenbeitrag.<br><router-link to="/about">So kannst du auch Sponsor werden</router-link></p>
          <button class="btn-close" @click="$emit('close')">✕</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'c-sponsor-modal',
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
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.sponsor-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#333, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;

  &__notice {
    margin-top: 1rem;
    background-color: $c-grey;
    padding: .5rem;
    border: 1px solid $c-grey-dark;
    border-radius: 4px;
    font-size: .8rem;
    margin-bottom: 0;
  }

  &__image {
    display: block;
    margin: 0 auto;
    margin-bottom: 1rem;
    max-width: 80%;
    max-height: 10rem;
  }
  &__inner {
    overflow-y: scroll;
    padding: 2rem;
    background-color: #fff;
    display: flex;
    max-width: 30rem;
    max-height: 90%;
    box-sizing: border-box;
    width: 90%;
    margin: 0 1rem;
    position: relative;
    border-radius: 6px;
    box-shadow: 0 6px 6px -4px rgba(#000, .3);
    border: 1px solid $c-grey;

    h3 {
      color: $c-black;
      margin-bottom: 0;
    }
    .address {
      display: block;
      font-size: .8rem;
      color: #888;
      margin-top: 1rem;
      margin-bottom: .25rem;
    }
    .link {
      font-size: .8rem;
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
      border: 1px solid $c-highlight;
      padding: .25rem .5rem;
      margin-top: .5rem;
      font-family: $f-body;
      font-size: .8rem;
      color: $c-highlight;
      cursor: pointer;
      z-index: 2;

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
