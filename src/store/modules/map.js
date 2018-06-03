import map from '../../api/map';

const state = {
  sponsoredEntries: [],
  mapCenter: null
}

const getters = {
  sponsoredEntries: state => state.sponsoredEntries,
  mapCenter: state => state.mapCenter
}

const actions = {
  getSponsoredEntries({ commit, dispatch }) {

    commit('LOAD_START');

    map.getSponsoredEntries()
      .then((entries) => {
        commit('LOAD_FINISH');
        commit('SET_SPONSOREDENTRIES', entries);
      },
      (error) => {
        commit('LOAD_FINISH');
        dispatch('handleError', error);
      }
    );
  },

  setMapCenter({ commit, dispatch }, center) {
    commit('SET_MAP_CENTER', center);
  }

}

const mutations = {
  SET_SPONSOREDENTRIES(state, entries) {
    state.sponsoredEntries = entries;
  },
  SET_MAP_CENTER(state, center) {
    state.mapCenter = center;
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
