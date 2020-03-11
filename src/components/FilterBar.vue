<template>
  <div class="filter-bar">
        <input type="checkbox">
        <c-datepicker id="from"
        :date="new Date()">
        </c-datepicker>
        <c-datepicker id="to"
        :date="new Date()">
        </c-datepicker>
        <label for="type">Type</label>
        <select id="type" @change="commitFilter" v-model="filter.type">
          <option value="null">Alle</option>
          <option value="fame">Fame</option>
          <option value="shame">Shame</option>
          <option value="fixed">Fixed</option>
        </select>
        <label for="hashtag">Hashtag</label>
        <select id="hashtag" @change="commitFilter" v-model="filter.hashtag">
          <option value="null">Alle</option>
          <option value="Hallo Velo">Hallo Velo</option>
          <option value="Todeszone">Todeszone</option>
          <option value="Scheile Geiss">Scheile Geiss</option>
          <option value="Auto Sumpf">Auto Sumpf</option>
        </select>
  </div>
</template>
<script>

import DatePicker from '@/components/DatePicker'

export default {
  name: 'c-filter-bar',
  props: ['filters'],
  data () {
    return {
      filter: {type:null, hashtag:null}
    }
  },
  components: {
    'c-datepicker' : DatePicker
  },
  watch: {

  },
  mounted() {

  },
  methods: {
    commitFilter() {
      this.$emit("change", this.filter);
    }
  }
}

</script>

<style lang="scss">

@import '../styles/helpers';

.filter-bar {
  background-color: #fafafa;
  display: flex;
  padding: 4px;
  box-shadow: 0 4px 10px 0 rgba(#000, .1);
}

</style>
