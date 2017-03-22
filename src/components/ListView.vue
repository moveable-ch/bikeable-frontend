<template>
  <div class="list">
    <ul>
      <li v-for="entry in entries">
        <router-link :to="'/entry/' + entry._id">
          <img :src="entry.image" alt="">
          <span class="title">{{ entry.title }}</span>
          <small>{{ entry.text }}</small>
        </router-link>
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

.list {
  max-width: 700px;
  margin: 1rem auto;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {

    a {
      display: block;
      background-color: #f0f0f0;
      margin: 1rem;
      padding: 1rem;
      text-decoration: none;
      position: relative;
      color: inherit;
      min-height: 6rem;
      padding-left: 11rem;
      box-sizing: border-box;

      .title {
        display: block;
        font-weight: bold;
      }
      img {
        height: 6rem;
        position:absolute;
        top: 0;
        left: 0;
      }

      &:hover {
        background-color: #ddd;
      }
    }
  }
}

</style>
