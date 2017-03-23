<template>
  <div class="entry clearfix">
    <div class="col">
      <img :src="currentEntry.image">
    </div>
    <div class="col">
      <h1>{{ currentEntry.title }}</h1>
      <h2>{{ currentEntry.address }}</h2>
      <p>{{ currentEntry.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'entry-view',
  props: [],
  data () {
    return {
      entryId: 0,
      currentEntry: {}
    }
  },

  computed: {
    entries() {
      return this.$store.state.entries
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

      this.$http.get('https://backend.bikeable.ch/api/entries/'+this.entryId).then(response => {
        this.currentEntry = response.body.data;
      }, response => {
        console.log(response);
      });
    }
  }
}
</script>

<style lang="scss" scoped>

  @import '../styles/helpers';

  .entry {
    max-width: 1200px;
    margin: 0;
    padding: 0;
    font-family: $f-body;

    img {
      max-width: 100%;
      height: auto;
    }
  }

  .col {
    box-sizing: border-box;
    padding: 1rem;

    @include desktop() {
      width: 50%;
      float: left;
      padding: 1.5rem;
    }
  }

  h1 {
    display: inline;
    line-height: 1;
    margin-top: 0;
    margin-bottom: 0;
  }
  h2 {
    margin-bottom: 1rem;
  }

</style>
