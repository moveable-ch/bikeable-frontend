<template>
  <div class="date-range-picker">
	 <!-- <functional-calendar :key="calendarIndex" v-model="datePickerData" @input="handleInput" :configs="calendarConfigs"></functional-calendar> -->
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
    <button class="reset" @click="reset">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
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
          format: 'dd.mm.yy',
          separator: ' - ',
          applyLabel: "OK",
          cancelLabel: this.$i18n.t("entry.cancel"),
           daysOfWeek: this.daysOfWeek(),
           monthNames: this.months(),
      }

    }
  },
  methods: {
    daysOfWeek() {
      var result = [];
      for(var i=0; i<7; i++){
        let d = new Date(2020,10,22+i);
        result.push(d.toLocaleDateString(this.$i18n.locale, {weekday: 'short'}));
      }
      return result;
    },
    months(){
      var result = [];
      for(var i=0; i<12; i++){
        let d = new Date(2020,i,1);
        result.push(d.toLocaleDateString(this.$i18n.locale, {month: 'short'}));
      }
      return result
    },
    formatDate(date) {
      if(!date) return '';
      let d = new Date(date);
      return d.toLocaleDateString('de-DE', {year: '2-digit', month: '2-digit', day: '2-digit'});
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

  .vue-daterange-picker {

    .form-control {
      width: auto !important;
      height: 2rem;
      line-height: 2rem !important;
      overflow: hidden;
      position: relative;
      background-color: #fff;
      border: 1px solid #eee !important;
      box-shadow: 0 1px 2px 0 rgba(#000, 0.05);
      box-sizing: border-box;
      border-radius: 4px;
      padding-top:0;
      padding-bottom:0;
      border:none;
      margin-right: 0.5em;
    }

    .daterangepicker {
      min-width: 0 !important;
    }

  }

  .reset {
    padding: 0 .4rem;
    width: 1.6rem;
    height: 1.6rem;
    -webkit-appearance: none;
    border: none;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 99%;
    font-size: 1.25rem;
    line-height: 2rem;
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

  .ranges {
    display:none;
  }

  .btn {
      line-height: 1rem;
      height: 1rem;
      margin:0;
    }

  .cancelBtn {
    color: black;
  }
}

</style>
