<template>
  <transition name="modal">
    <div class="delete-modal" @click="$emit('close')">
      <div class="delete-modal__inner" @click.stop>
          <div class="entry-modal__content">
            <h3>Diesen Eintrag wirklich löschen?</h3>
          </div>
            <button class="btn-del" @click="deleteSpot">{{ $t('entry.deletespot') }}</button>
            <button class="btn-cancel" @click="$emit('close')">{{ $t('entry.cancel') }}</button>
        <button class="btn-close" @click="$emit('close')">✕</button>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'c-delete-modal',
  props: ['entryId'],
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
    deleteSpot() {

      this.$store.dispatch('deleteSpot', {
          id: this.entryId
      })
      .then(() => {
          this.$router.push('/');
        });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(#000, .4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;

  h3 {
    margin-right: 40px !important;
  }

  &__content {
    overflow: hidden;
    width: calc(100% - 5rem);
    padding: .5rem 1rem;
  }
  &__map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &__inner {
    background-color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 1rem;
    width: 80%;
    min-height: 10rem;
    max-width: 30rem;
    max-height: 20rem;
    position: relative;
    border-radius: 4px;
    box-shadow: 0 6px 6px -4px rgba(#000, .3);
    border: 1px solid $c-grey;
    padding: 2rem;

    .btn-close {
      font-size: 1.5rem;
      font-weight: 600;
      padding: 0;
      background: none;
      border: none;
      position: absolute;
      top: 1rem;
      right: 1rem;
      background-color: $c-black;
      color: #fff;
      width: 3rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      z-index: 0;
      cursor: pointer;
      border-radius: 99%;
      box-shadow: 0 6px 6px -4px rgba(#000, .3);

      &:active, &:focus {
        outline: none;
        color: $c-main;
      }
      &:hover {
        color: $c-main;
      }
    }
  }

  .btn-del {
    background: none;
    border: none;
    padding: 0;
    position: absolute;
    bottom: 3.5rem;
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
  }

  .btn-cancel {
    background: none;
    border: solid 1px $c-main;
    padding: 0;
    position: absolute;
    bottom: 4px;
    left: 4px;
    border-radius: 4px;
    width: calc(100% - 8px);
    height: 3rem;
    line-height: 3rem;
    background-color: $c-white;
    color: $c-main;
    font-family: $f-body;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;

    &:active, &:focus {
      outline: none;
    }
  }
}

.modal-enter-active, .modal-leave-active {
  transition: .4s opacity;

  .delete-modal__inner {
    transition: .4s transform ease-out;
  }
}
.modal-enter, .modal-leave-to {
  opacity: 0;

  .delete-modal__inner {
    transform: translateY(40px);
  }
}

</style>
