<template>
  <div id="app">
    <header-view></header-view>
    <router-view :entries="entries"></router-view>
  </div>
</template>

<script>
import HeaderView from '@/components/HeaderView'

export default {
  name: 'app',
  data () {
    return {
      entries: [
        {
          id: 0,
          title: 'Grünes Licht',
          text: 'Warum hier kein grünes Licht für Velofahrer? Völlig ausreichend Platz.',
          image: 'https://unsplash.it/400/350',
          coords: [8.5274280, 47.3769824],
          address: 'Hohlstrasse 17, Zürich',
          rating: 10,
          username: 'hans'
        },
        {
          id: 1,
          title: 'Einbahn Keinbahn',
          text: 'Die bekannteste Ausgehmeile der Schweiz und als Velofahrer nicht passierbar. Wo ist da die Logik. Geht etwa jemand mit dem Auto in den Klub?',
          image: 'https://unsplash.it/400/200',
          coords: [8.5277422, 47.3794912],
          address: 'Langstrasse 124, Zürich',
          rating: 5,
          username: 'peter'
        },
        {
          id: 2,
          title: 'Voll neu und ohne Velostreifen',
          text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae rerum officia repellendus odio. Ipsum laborum vel, libero modi deleniti. Ea, fuga, natus velit ipsum voluptate perspiciatis molestiae odio iste quisquam.',
          image: 'https://unsplash.it/400/300',
          coords: [8.5209394, 47.3750488],
          address: 'Badenerstrasse 170, Zürich',
          rating: 7,
          username: 'chantalle'
        },
        {
          id: 3,
          title: 'Es wäre so schön...',
          text: 'Warum hier nicht dem Velofahrer erlauben, dem Wahnsinn des Bucheggplatzes zu entschweben? Es gibt genug Platz und es muss nur ein Schild ausgewechselt werden.',
          image: 'https://unsplash.it/400/250',
          coords: [8.5335645, 47.3985240],
          address: 'Hofwiesenstrasse 114, Zürich',
          rating: 9,
          username: 'babette'
        }
      ]
    }
  },
  components: {
    'header-view': HeaderView
  }
}
</script>

<style src="./styles/global.scss" lang="scss"></style>
<style>
#app {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  position: relative;
}
</style>
