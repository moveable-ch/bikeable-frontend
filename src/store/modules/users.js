import users from '../../api/users';

const state = {
  userData: [],
  userCoords: false
}

const getters = {
  userData: state => state.userData,
  userCoords: state => state.userCoords,
}

const actions = {
  getUserData({ commit, dispatch }) {

    commit('LOAD_START');
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    users.getUserData({
        userId: userId,
        authToken: token
      })
      .then((data) => {
        commit('LOAD_FINISH');
        commit('SET_USER_DATA', data);
      },
      (error) => {
        commit('LOAD_FINISH');
        dispatch('handleError', error);
      }
    );

  },

  getUserCoords({ commit, dispatch }) {
    if (navigator.geolocation) {
      let timeoutVal = 10 * 1000 * 1000;

      navigator.geolocation.getCurrentPosition(
        function(loc) {
          let coords = {
            lat: loc.coords.latitude,
            lng: loc.coords.longitude
          };
          commit('SET_USER_COORDS', coords);

        }.bind(this),
        function(e) {
          console.log('error');
        },
        { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
      );
    }
  }
}

const mutations = {
  SET_USER_DATA(state, entries) {
    state.userData = entries;
  },
  SET_USER_COORDS(state, coords) {
    state.userCoords = coords;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
