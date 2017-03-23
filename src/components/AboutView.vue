<template>
  <div class="about">
    <h1>About</h1>
    <p>Bikeable.ch zeigt die ärgsten Probleme der Velofahrenden mitsamt Lösungsmöglichkeiten auf. Der User schiesst ein Foto der Stelle und lädt es mit Kommentar auf die Seite. Auf der Kartenansicht wird die Stelle markiert. Andere User können die übelsten Stellen upvoten. Jene Stelle mit den meisten Voten landet zuoberst auf der Wall of Shame. Gleichzeitig können gute Beispiele auf der Hall of Fame Seite aufgezeigt werden und zu allen Problemstellen soll eine lösungsorientierte Diskussion ermöglicht werden. Wir sind ein Verein von jungen Velobegeisterten und möchten mit dem Projekt Züri und die Welt velofreundlicher machen.</p>
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

@import '../styles/helpers';

.about {
  max-width: 700px;
  margin: 0;
  padding: 1rem;

  @include desktop() {
    padding: 1rem 2rem;
  }
}

h1 {
  display: inline-block;
  position: relative;
}

</style>
