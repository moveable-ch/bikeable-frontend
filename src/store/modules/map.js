import map from '../../api/map';

const state = {
  sponsoredEntries: []
}

const getters = {
  sponsoredEntries: state => state.sponsoredEntries
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

  }
}

const mutations = {
  SET_SPONSOREDENTRIES(state, entries) {
    state.sponsoredEntries = entries;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
