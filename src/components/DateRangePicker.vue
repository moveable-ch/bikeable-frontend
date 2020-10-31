<template>
  <div class="date-range-picker">
	 <functional-calendar :key="calendarIndex" v-model="datePickerData" @input="handleInput" :configs="calendarConfigs"></functional-calendar>
   <button class="reset" @click="reset">
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
   </button>
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
  data() {
    return {
      datePickerData: {},
      calendarConfigs: {
        dateFormat: 'dd.mm.yyyy',
        isDateRange: true,
        isModal: true
      },
      calendarIndex: 1
    }
  },
  methods: {
    handleInput(data) {
      this.$emit('input', data);
    },
    reset() {
      this.datePickerData = {};
      this.calendarIndex = Math.round(Math.random()*99999);
      this.$emit('input', this.datePickerData);
    }
  }
}
</script>
<style lang="scss">

@import '../styles/helpers';

.date-range-picker {
  position: relative;
  padding-right: 1.75rem;

  input {
    height: 2rem;
    line-height: 2rem;
  }
  input[type=text] {
    width: auto !important;
  }
  .reset {
    position: absolute;
    right: 0;
    top: .25rem;
    padding: 0 .4rem;
    width: 1.5rem;
    height: 1.5rem;
    -webkit-appearance: none;
    border: none;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 99%;
    font-size: 1.25rem;
    line-height: 1.5rem;
    cursor: pointer;

    &:focus, &:active {
      outline: none;
      border-color: #ccc;
    }
    &:hover {
      border-color: #aaa;

      svg {
        opacity: .8;
      }
    }

    svg {
      width: 100%;
      height: 100%;
      opacity: .5;
    }
  }
}

</style>