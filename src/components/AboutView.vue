<template>
  <div class="about">
    <h1>bikeable.ch <span>beta</span></h1>
  </div>
</template>

<script>
export default {
  name: 'about-view',
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>

.about {
  max-width: 700px;
  margin: 1rem auto;
  text-align: center;
}

h1 {
  display: inline-block;
  position: relative;

  span {
    font-size: .8rem;
    position: absolute;
    right: -2.5rem;
    top: 0;
    font-weight: normal;
    text-transform: uppercase;
  }
}

</style>
