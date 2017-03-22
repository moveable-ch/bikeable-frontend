<template>
  <div class="list">
    <ul>
      <li v-for="entry in entries">
        <router-link :to="'/entry/' + entry._id">{{ entry.title }}</router-link><br>
        <small>{{ entry.text }}</small>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'list-view',
  props: [],
  computed: {
    entries() {
      return this.$store.state.entries
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    display: block;
    background-color: #f0f0f0;
    margin: 1rem;
    padding: 1rem;
  }
}

</style>
