<template>
  <transition name="modal">
    <div class="entry-modal">
      <div class="entry-modal__inner">
        {{ entryId }}<br>
        -- entry infos --<br>
        <button @click="$emit('close')">Close</button>
        <button @click="showEntry">Show Entry</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'entry-modal-view',
  props: ['entryId'],
  data () {
    return {}
  },
  methods: {
    showEntry() {
      this.$router.push({ name: 'entry', params: { id: this.entryId }});
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

  &__inner {
    padding: 1rem;
    background-color: #fff;
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
