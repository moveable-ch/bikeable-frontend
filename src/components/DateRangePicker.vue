<template>
  <div class="date-range-picker">
	 <functional-calendar :is-modal='true' :is-date-range='true'></functional-calendar>
  </div>
</template>
<script>

import { FunctionalCalendar } from 'vue-functional-calendar';

export default {
  name: 'c-date-range-picker',
  props: ['date'],
  data () {
    return {
    }
  },
  components: {
  	 'functional-calendar' : FunctionalCalendar,
  },
  data() {
      return {
          calendarData: {}
      }
  },
  watch: {

  },
  mounted() {

  },
  methods: {
	misc() {

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
