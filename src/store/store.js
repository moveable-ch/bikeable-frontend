import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(VueResource)

const state = {
  entries: false,
  userCoords: false
}

const mutations = {
  SET_ENTRIES(state, entries) {
    state.entries = entries;
  },
  SET_USER_COORDS(state, coords) {
    state.userCoords = coords;
  }
}

const actions = {
  loadEntries(context) {
    Vue.http.get('https://backend.bikeable.ch/api/entries').then(response => {
      context.commit('SET_ENTRIES', response.body.data);
    }, response => {
      console.log(response);
    });
  },
  getUserCoords(context) {
    if (navigator.geolocation) {
      let timeoutVal = 10 * 1000 * 1000;

      navigator.geolocation.getCurrentPosition(
        function(loc) {
          let coords = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude
          };
          context.commit('SET_USER_COORDS', coords);

        }.bind(this),
        function(e) {
          console.log('error');
        },
        { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
      );
    }
  }
}

const getters = {

}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
