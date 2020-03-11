<template>
  <div class="filter-bar">
        <input type="checkbox">
        <c-datepicker id="from"
        :date="new Date()">
        </c-datepicker>
        <c-datepicker id="to"
        :date="new Date()">
        </c-datepicker>
        <label for="type">Typ</label>
        <select id="type">
          <option value="all">Alle</option>
          <option value="fame">Fame</option>
          <option value="shame">Shame</option>
          <option value="fixed">Fixed</option>
        </select>
        <label for="hashtag">Hashtag</label>
        <select id="hashtag">
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
  props: ['from', 'to', 'type', 'hashtag'],
  data () {
    return {
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
  misc() {

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
