import regions from '../../api/regions';

const state = {
  selectedRegion: "",
  regions: [],
  pending: false
}

const mutations = {
  SET_REGIONS(state, regions) {
    state.regions = regions;
  },
  SET_SELECTEDREGION(state, selectedRegion){
    state.selectedRegion = selectedRegion;
  },
  LOAD_START(state) {
    state.pending = true;
  },
  LOAD_FINISH(state) {
    state.pending = false;
  }
}


const getters = {
  regions: state => state.regions,
  selectedRegion: state => state.selectedRegion
}

const actions = {
  getRegions({ commit, dispatch, getters }) {

    commit('LOAD_START');
    
    regions.getRegions()
      .then((regions) => {
        commit('LOAD_FINISH');
        commit('SET_REGIONS', regions);
      },
      (error) => {
        commit('LOAD_FINISH');
        dispatch('handleError', error);
      });
  },

  setSelectedRegion(context, selectedRegion) {
    console.log("HELLO", selectedRegion);
    localStorage.setItem('selectedRegion', selectedRegion);
    context.commit('SET_SELECTEDREGION', selectedRegion);
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
