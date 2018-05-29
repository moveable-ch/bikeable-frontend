// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import SocialSharing from 'vue-social-sharing'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import VueHead from 'vue-head'
import store from '@/store'

Vue.use(VueHead);
Vue.use(SocialSharing);
Vue.use(VueI18n);

var lang = navigator.language;

if(["de", "en", "fr"].indexOf(lang) > -1) {
	lang = "de";
};

const i18n = new VueI18n({
  locale: lang, // set locale
  messages: {
	  "de": {
	  	 "home": {
		    "registernow": "Jetzt registrieren!",
		    "addspot": "Spot hinzufügen",
		    "showall": "Alle Spots anzeigen",
		    "more": "Mehr",
		    "newsletter": "Melde dich hier für unseren Newsletter an und erfahre regelmässig, was bei bikeable läuft.",
		    "nospam": "Kein Spam imfall!",
		    "emailadress": "Email-Adresse",
		    "surname": "Vorname",
		    "familyname": "Nachname"
		},
		"about": {
			"paypal": "Unterstütze uns via PayPal",

		},
		"addform": {
			"addspot": "Spot erstellen",
			"photo": "Foto",
			"uploadimage": "Lade ein Bild von deinem Spot hoch",
			"chooseimage": "Bild wählen",
			"loading": "Loading",
			"adress": "Adresse",
			"spotwhere":"Wo befindet sich dein Spot?",
			"entercurrentlocation":"Aktuellen Standort einfügen",
			"chooselocation":"Standort auf Karte wählen",
			"description": "Beschreibung",
			"send": "Senden"
		},
		"editform": {
			"editspot": "Spot bearbeiten"
		},
		"entry": {
			"fixed": "Dieser Spot wurde in der Zwischenzeit verbessert.",
			"register": "Jetzt registrieren und mitdiskutieren!",
			"send": "Senden"
		},
		"list": {
			"sortby": "Sortieren nach",
			"date": "Datum",
			"upvotes": "Upvotes",
			"distance": "Distanz",
			"comments": "Kommentare",
			"allspots": "Alle Spots",
			"morespots":"Mehr Spots anzeigen"

		},
		"login":{
			"forgotpassword": "Passwort vergessen?",
			"newaccount": "Neuen Account erstellen"
		},
		"notfound": {
			"pagenotfound":	"Die Seite wurde nicht gefunden"
		},
		"partner": {
			"partner": "Partner",
		},
		"password": {
			"forgot": "Passwort vergessen",
			"send": "Senden"
		},
		"register": {
			"register": "Registrieren",
			"username": "Username",
			"email": "E-Mail",
			"password": "Passwort",
			"send": "Senden",
			"succesfullregistered": "Erfolgreich registriert, bitte Account bestätigen."
		},
		"profile": {
			"preferences": "Eistellungen",
			"username": "Username",
			"email": "E-Mail",
			"avatar": "Avatar",
			"avatarupload": "Neuen Avatar hochladen",
			"loading": "Loading",
			"save": "Speichern"
		}
	  }
  }
})

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
