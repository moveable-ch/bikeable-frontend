<template>
  <div class="contentpage notfound">
    <div class="container">
      <img src="https://media.giphy.com/media/StWnlQipuBrz2/giphy.gif">
      <h1>404</h1>
      <p>Die Seite wurde nicht gefunden</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'v-not-found',
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
  text-align: center;
  margin-top: 0;

  @include desktop() {
    margin-top: -2rem;
  }

  img {
    width: 90%;
    max-width: 500px;
    height: auto;
  }
  h1 {
    margin-top: -3rem;
    margin-bottom: 1rem;
    text-shadow: -2px -2px 0 #fff;
    color: $c-highlight;
    z-index: 1;
    font-size: 5rem;
    position: relative;
  }
  p {
    max-width: none;
    margin: 0;
    font-weight: 700;
    color: $c-highlight;
  }
}


</style>
