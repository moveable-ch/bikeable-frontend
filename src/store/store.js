import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(VueResource)

const state = {
  entries: []
}

const mutations = {
  SET_ENTRIES(state, entries) {
    state.entries = entries;
  }
}

const actions = {
  loadEntries(context) {
    Vue.http.get('http://backend.bikeable.ch/api/entries').then(response => {
      context.commit('SET_ENTRIES', response.body.data);
    }, response => {
    });
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
