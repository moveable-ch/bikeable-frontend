<template>
  <div class="entry">
    <img :src="currentEntry.image">
    <h1>{{ currentEntry.title }}</h1>
    <h2>{{ currentEntry.address }}</h2>
    <p>{{ currentEntry.text }}</p>

  </div>
</template>

<script>
export default {
  name: 'entry-view',
  props: ['entries'],
  data () {
    return {
      entryId: 0,
      currentEntry: {}
    }
  },

  watch: {
    '$route' (to, from) {
      this.fetchData();
    }
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    fetchData() {
      this.entryId = this.$route.params.id;
      this.currentEntry = this.entries[this.entryId];
    }
  }
}
</script>

<style lang="scss" scoped>

  .entry {
    max-width: 700px;
    margin: 1rem auto;
    background-color: #f0f0f0;
    padding: 2rem;
  }

</style>
