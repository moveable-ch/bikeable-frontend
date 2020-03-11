<template>
	<Datepicker :value="date" name="uniquename"></Datepicker>
</template>

<script>

import Datepicker from 'vuejs-datepicker';

export default {
  name: 'c-datepicker',
  props: ['date'],
  data () {
    return {
    }
  },
  components: {
  	Datepicker
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

</style>
