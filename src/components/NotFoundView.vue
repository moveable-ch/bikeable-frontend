<template>
  <div class="contentpage notfound">
    <div class="container">
      <h1>404</h1>
      <p>Die Seite wurde nicht gefunden.</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'not-found-view',
  data () {
    return {
      doc: null
    }
  },
  mounted() {

  },
  methods: {
  }
}
</script>

<style lang="scss">

@import '../styles/helpers';

.notfound {

}


</style>
