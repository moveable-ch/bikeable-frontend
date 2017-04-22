<template>
  <div class="map-info">
  </div>
</template>

<script>
export default {
  name: 'map-info',
  props: ['active-entry'],
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>

.map-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 20rem;
  height: 100px;
  background-color: rgba(#333, .8);
  box-shadow: 0 0 15px 0 rgba(#000, .1);
  color: #fff;
  padding: 1rem;
  box-sizing: border-box;
  z-index: 2;
  background-color: #fff;

}

</style>
