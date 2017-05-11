<template>
  <transition name="modal">
    <div class="add-modal" @click="$emit('close')">
      <div class="add-modal__inner" v-if="coords" @click.stop>
        <div class="add-modal__content">
          <h2>{{ address }}</h2>
          <button class="btn-show" v-if="address" @click="addSpot">Spot hinzufügen</button>
          <button class="btn-close" @click="$emit('close')">✕</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'add-modal-view',
  props: ['coords'],
  data () {
    return {
      address: ''
    }
  },
  watch: {
    'coords': function() {
      this.getAddress();
    }
  },
  mounted() {
    this.getAddress();
  },
  methods: {
    getAddress() {
      if(!this.coords) return;
      let latlng = this.coords.lat + ',' + this.coords.lng;

      this.$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '&key=AIzaSyDSPhuEAL3Hv0zmbnhGQlTu9ax0uLXmuOE').then(response => {
        if(response.body.results[0].formatted_address != '') {
          this.address = response.body.results[0].formatted_address;
        }
      }, response => {
        this.$store.dispatch('handleError', 'Keine Addresse gefunden');
        this.$emit('close');
      });
    },
    addSpot() {
      this.$router.push({ name: 'add', params: { coords: this.coords }});
    }
  }
}
</script>

<style lang="scss" scoped>

@import '../styles/helpers';

.add-modal {
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
