import spots from '../../api/spots';

const state = {
  allSpots: [],
  lightSpots: [],
  listSort: 'date',
  listFilter: null
}

const getters = {
  allSpots: state => state.allSpots,
  lightSpots: state => state.lightSpots,
  mySpots: state => state.mySpots,
  listSort: state => state.listSort,
  listFilter: state => state.listFilter,
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
  // getListSpots({ commit, dispatch, getters }, limit, sort) {

  //   commit('LOAD_START');

  //   let coords = getters.userCoords ? getters.userCoords : null;
  //   let filter = localStorage.getItem('listFilter');
  //   let region = localStorage.getItem('selectedRegion');

  //   spots.getAllSpots({
  //       limit: limit,
  //       filter: filter,
  //       sort: sort,
  //       location: coords,  
  //       region: region
  //     })
  //     .then((entries) => {
  //       commit('LOAD_FINISH');
  //       commit('SET_SPOTS', entries);
  //     },
  //     (error) => {
  //       commit('LOAD_FINISH');
  //       dispatch('handleError', error);
  //     });
  // },
  getLightSpots({ commit, dispatch, getters }, filter) {

    commit('LOAD_START');

    spots.getLightSpots(filter)
      .then((entries) => {
        commit('LOAD_FINISH');
        commit('SET_LIGHT_SPOTS', entries);
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
  },
  deleteSpot({ commit, dispatch }, data) {
    commit('LOAD_START');

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      spots.deleteSpot({
          data: data,
          userId: userId,
          authToken: token
        })
        .then((data) => {
          commit('LOAD_FINISH');
          resolve();
        },
        (error) => {
          commit('LOAD_FINISH');
          dispatch('handleError', error);
          reject(error);
        });
    });
  },
  editSpot({ commit, dispatch }, data) {
    commit('LOAD_START');

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      spots.editSpot({
          data: data.data,
          spotId: data.spotId,
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
  },
  addPhoto({ commit, dispatch }, data) {
    commit('LOAD_START');

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      spots.addPhoto({
          data: data.data,
          spotId: data.spotId,
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
  },
  addCategory({ commit, dispatch }, data) {
    commit('LOAD_START');

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      spots.addCategory({
          spotId: data.spotId,
          categoryId: data.categoryId,
          userId: userId,
          authToken: token
        })
        .then((data) => {
          commit('LOAD_FINISH');
          resolve(data);
        },
        (error) => {
          commit('LOAD_FINISH');
          dispatch('handleError', error);
          reject(error);
        });
    });
  },
  setListFilter(context, listFilter) {
    localStorage.setItem('listFilter', listFilter);
    context.commit('SET_LIST_FILTER', listFilter);
  }
}

const mutations = {
  SET_SPOTS(state, entries) {
    state.allSpots = entries;
  },
  SET_LIGHT_SPOTS(state, entries) {
    state.lightSpots = entries;
  },
  SET_LIST_SORT(state, sort) {
    state.listSort = sort;
  },
  SET_LIST_FILTER(state, filter) {
    state.listFilter = filter;
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
}
