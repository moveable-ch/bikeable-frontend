<template>
  <div class="date-range-picker">
	 <functional-calendar @input="handleInput" @dayClicked="$emit('change')" :is-modal='true' :is-date-range='true'></functional-calendar>
  </div>
</template>
<script>

import { FunctionalCalendar } from 'vue-functional-calendar';

export default {
  name: 'c-date-range-picker',
  props: ['date'],
  components: {
  	 'functional-calendar' : FunctionalCalendar,
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    handleInput(data) {
      this.$emit('input', data);
    }
  }
}
</script>
<style lang="scss">

@import '../styles/helpers';

.date-range-picker {


  input {
    height: 1.5rem;
  }
}

</style>
