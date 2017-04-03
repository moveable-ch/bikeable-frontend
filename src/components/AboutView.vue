<template>
  <div class="about clearfix">
    <div class="col">
      <h1>About</h1>
      <p class="lead">Bikeable.ch zeigt die ärgsten Probleme der Velofahrenden mitsamt Lösungsmöglichkeiten auf.</p>
      <p>Der User schiesst ein Foto der Stelle und lädt es mit Kommentar auf die Seite. Auf der Kartenansicht wird die Stelle markiert. Andere User können die übelsten Stellen upvoten. Jene Stelle mit den meisten Voten landet zuoberst auf der Wall of Shame. Gleichzeitig können gute Beispiele auf der Hall of Fame Seite aufgezeigt werden und zu allen Problemstellen soll eine lösungsorientierte Diskussion ermöglicht werden. Wir sind ein Verein von jungen Velobegeisterten und möchten mit dem Projekt Züri und die Welt velofreundlicher machen.</p>
      <h1>Wer wir sind</h1>
      <p>Wir sind eine Gruppe von jungen Leuten, die gerne Velofahren und dies gerne noch lieber tun würden. Zur Umsetzung der Idee bikeable.ch haben wir uns in einem Verein zusammengeschlossen. Aktiv an der Umsetzung beteiligt sind:</p>
      <ul>
        <li>Hannes Heller</li>
        <li>Luca Naterop</li>
        <li>Seraina Manser</li>
        <li>Nora Gailer</li>
        <li>Samuel Alder</li>
      </ul>
    </div>
    <div class="col">
      <h1>FAQ</h1>
      <h3>Was ist bikeable.ch?</h3>
      <p>Bikeable.ch zeigt die gefährlichsten und lästigsten Stellen für Velofahrer auf. Der User schiesst ein Foto der Stelle und lädt es mit Kommentar auf die Seite. Auf der Kartenansicht wird die Stelle markiert. Andere User können die übelsten Stellen upvoten. Jene Stelle mit den meisten Voten landet zuoberst auf der Wall of Shame. Gleichzeitig können gute Beispiele auf der Hall of Fame Seite aufgezeigt werden und zu allen Problemstellen soll eine lösungsorientierte Diskussion ermöglicht werden.</p>
      <h3>Was ist das Ziel von bikable.ch?</h3>
      <p>Die Infrastruktur für den Veloverkehr verbessern. Viele Velofahrer nerven sich über gefährliche Kreuzungen oder undurchgängige Velowege und haben keine Möglichkeit auf diese Missstände aufmerksam zu machen und sie womöglich was zu ändern. Bikable.ch ist eine Plattform, die solche gefährliche und schlecht konzipierte Stellen sammelt. Bikable.ch.ch zeigt so auf, wo Verbesserungen in der Infrastruktur nötig sind. Der Bevölkerung und den Verantwortlichen wird somit ein demokratisches Planungswerkzeug zur Verfügung gestellt. Die Benutzer der Infrastruktur selbst zeigen die Missstände auf, priorisieren sie und können gleich Lösungsvorschläge einbringen. Der Politik wird der Bedarf aufgezeigt ohne  kostspielige Evaluationen durch spezialisierte Unternehmen, welche bereits eine erste Hürde für Veloinfrastrukturprojekte darstellen.</p>
      <h3>An wen gehen die Meldungen?</h3>
      <p>Es ist nicht vorgesehen, dass direkt Meldungen an zuständige Ämter versendet werden. Die Plattform ist für diese jedoch zugänglich. Medien, Politiker sowie Privatpersonen haben mit der Plattform die Möglichkeit, Bedarf und Lösung zugleich aufzuzeigen und somit Druck auszuüben. Social Media Einbindung soll dies zusätzlich erleichtern.</p>
      <h3>Wer kann bikable.ch nutzen?</h3>
      <p>Jeder und Jede. Eine Registrierung ist optional für volle Funktionalität.</p>
      <h3>Was nützt mir als User bikable.ch?</h3>
      <p>Das Ziel von bikable.ch ist es, mittel- und langfristig die Infrastruktur für Velofahrer in der Schweiz zu verbessern. Du erhältst mit bikable.ch eine Plattform, auf der du mangelnde Infrastruktur für Velofahrer anprangern kannst. Vielleicht verschwindet dank deines Inputs tatsächlich das unnütze Fahrverbot oder der gefährliche Randstein beim nächsten Umbau.</p>
      <h3>Was muss ich tun, um einen Beitrag zu posten? </h3>
      <p>Schiesse ein Foto, lade es mit einem kurzen Kommentar auf die Webseite und sage, wo du dich gerade befindest.</p>
      <h3>Wo funktioniert bikeable.ch?</h3>
      <p>Auf der ganzen Welt! Vorerst konzentrieren wir uns auf unsere nähere Umgebung, im Prinzip sind der Plattform aber keine Grenzen gesetzt.</p>
      <h3>Wer steckt hinter bikable.ch?</h3>
      <p>Fünf junge, unabhängige Menschen, wohnhaft in der Stadt Zürich, und alle begeisterte Velofahrer*innen. </p>
    </div>
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
  // max-width: 700px;
  margin: 0;
  margin-bottom: 4rem;
  padding: 1rem;

  @include desktop() {
    padding: 1rem 2rem;
  }
}

.col {

  @include desktop() {
    width: 50%;
    float: left;
    padding-right: 2rem;
    box-sizing: border-box;
  }
}

h1 {
  position: relative;
}

h3 {
  font-family: $f-body;
  text-transform: none;
  font-weight: 700;
  border-bottom: 1px solid #333;
  color: #000;
  padding: .3rem 0;
  margin-bottom: .5rem;
}
p + h3 {
  margin-top: 2rem;
}

ul {
  padding-left: 1.5rem;
  margin: 1.5rem 0;

  li {
    margin: 1rem 0;

    &::before {
      content: "— ";
    }
  }
}

img {
  max-width: 100%;
  height: auto;
}

</style>
