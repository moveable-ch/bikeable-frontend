import {Loader, LoaderOptions} from 'google-maps';
import map from '../../api/map';

const state = {
  sponsoredEntries: [],
  mapFilter: null,
  mapCenter: null,
  google: null
}

const getters = {
  sponsoredEntries: state => state.sponsoredEntries,
  mapFilter: state => state.mapFilter,
  mapCenter: state => state.mapCenter,
  google: state => state.google
}

const actions = {
  setMapFilter(filter) {
    commit('SET_MAP_FILTER', filter);
    dispatch('getLightSpots', filter);
  },
  
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
  },

  initMapsApi({ commit, dispatch, state }) {
    const loader = new Loader(process.env.VUE_APP_GOOGLEKEY, {});

    loader.load().then((google) => {
      state.google = google;
    });
  }

}

const mutations = {
  SET_MAP_FILTER(state, filter) {
    state.mapFilter = filter;
  },
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
