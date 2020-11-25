<template>
  <div class="date-range-picker">
	 <!-- <functional-calendar :key="calendarIndex" v-model="datePickerData" @input="handleInput" :configs="calendarConfigs"></functional-calendar> -->

   <!-- <button class="reset" @click="reset"> -->
     <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg> -->

    <date-range-picker
            ref="picker"
            :locale-data=localedata
            v-model="datePickerData"
            opens="right"
            @update="handleInput"
    >
        <template v-slot:input="picker">
            {{ formatDate(picker.startDate) }} - {{ formatDate(picker.endDate) }}
        </template>
    </date-range-picker>

   </button>
  </div>
</template>
<script>

import DateRangePicker from 'vue2-daterange-picker'

import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'

export default {
  name: 'c-date-range-picker',
  props: ['date'],
  components: {
  	 'date-range-picker' : DateRangePicker,
  },
  data() {
    return {
      datePickerData: {
        startDate: null,
        endDate: null
      },
      isDateRange: true,
      isModal: true,
      localedata: {
          direction: 'ltr',
          format: 'dd.mm.yyyy',
          separator: ' - ',
          applyLabel: 'Ok',
          cancelLabel: 'Cancel',
          weekLabel: 'W',
          // customRangeLabel: 'Custom Range',
          // daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          // monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          firstDay: 0
      }

    }
  },
  methods: {
    formatDate(date) {
      if(!date) return '';
      let d = new Date(date);
      return d.toLocaleDateString('de-DE');
    },
    handleInput(data) {
      this.$emit('input', { dateRange: { start: this.formatDate(data.startDate), end: this.formatDate(data.endDate) }});
    },
    reset() {
      this.datePickerData = {
        startDate: null,
        endDate: null
      };
      this.calendarIndex = Math.round(Math.random()*99999);
      this.$emit('input', this.datePickerData);
    },
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
