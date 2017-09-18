import spots from '../../api/spots';

const state = {
  allSpots: [],
  listSort: 'votes'
}

const getters = {
  allSpots: state => state.allSpots,
  listSort: state => state.listSort
}

const actions = {
  getAllSpots({ commit, dispatch, getters }) {

    commit('LOAD_START');

    let coords = getters.userCoords ? getters.userCoords : null;

    spots.getAllSpots({
        location: coords
      })
      .then((entries) => {
        commit('LOAD_FINISH');
        commit('SET_SPOTS', entries);
      },
      (error) => {
        commit('LOAD_FINISH');
        dispatch('handleError', error);
      });
  },

  addSpot({ commit, dispatch }, data) {
    commit('LOAD_START');

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      spots.addSpot({
          data: data,
          userId: userId,
          authToken: token
        })
        .then((data) => {
          commit('LOAD_FINISH');
          dispatch('getAllSpots');
          resolve(data);
        },
        (error) => {
          commit('LOAD_FINISH');
          dispatch('handleError', error);
          reject(error);
        });
    });
  }
}

const mutations = {
  SET_SPOTS(state, entries) {
    state.allSpots = entries;
  },
  SET_LIST_SORT(state, sort) {
    state.listSort = sort;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
