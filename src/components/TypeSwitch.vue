<template>
  <div>
    <label for="type">{{ $t('filterbar.type') }}</label>
    <div class="typeswitch">
      <select v-model="currentType">
        <option value="">{{ $t('filterbar.alltypes') }}</option>
        <option value="fame">Fame</option>
        <option value="shame">Shame</option>
      </select>
    </div>
  </div>
</template>

<script>

export default {
  name: 'type-switch',
  props: [],
  data () {
    return {
      currentType: '',
      switcherVisible: false
    }
  },
  computed: {
    selectedType() {
      return this.$store.getters.selectedType;
    }
  },
  watch: {
    currentType(to, from) {
      this.setType(to);
    },
    selectedType(to, from) {
      this.currentType = this.selectedType;
    }
  },
  mounted() {
    if(this.selectedType != '') {
      this.currentType = this.selectedType;
    }
  },
  methods: {
    setType(type) {
      this.switcherVisible = false;

      this.$store.dispatch('setSelectedType', type);
      .then((data) => {
        this.type
        }, (data) => {
          this.$store.dispatch('handleError', 'Error');
        });
    }
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.typeswitch {
  max-width: 100%;
  padding-left: 20px;
  position: relative;
  display: flex;
  background-color: #fff;
  border: 1px solid #eee;
  box-shadow: 0 1px 2px 0 rgba(#000, 0.05);
  box-sizing: border-box;
  border-radius: 4px;
  margin: 0 1rem 0 0;

  &::before {
    content: "";
    display: block;
    padding: 3px;
    position: absolute;
    top: 50%;
    left: 10px;
    border: solid $c-black;
    border-width: 0 2px 2px 0;
    transform: translateY(-50%) rotate(45deg);
    transform-origin: 50% 50%;
  }

  select {
      font-size: 1rem;
      line-height: 1.1;
      color: $c-black;
      padding: 0.5rem;
      border: none;
      border-radius: 0;
      box-shadow: none;
      background: transparent;
      background-image: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;

      &::-ms-expand {
        display: none;
      }

      &:focus {
        outline: none;
      }

      &:hover {
        text-decoration: underline;
      }

  }
}

</style>
