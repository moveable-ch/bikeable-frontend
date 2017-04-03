import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(VueResource)

const state = {
  isLoggedIn: !!localStorage.getItem('token'),
  pending: false,
  entries: false,
  userCoords: false
}

const mutations = {
  LOAD_START(state) {
    state.pending = true;
  },
  LOAD_FINISH(state) {
    state.pending = false;
  },
  SET_ENTRIES(state, entries) {
    state.entries = entries;
  },
  SET_USER_COORDS(state, coords) {
    state.userCoords = coords;
  },
  LOGIN(state) {
    state.isLoggedIn = true;
  },
  LOGOUT(state) {
    state.isLoggedIn = false;
  }
}

const actions = {
  register(context, data) {

    context.commit('LOAD_START');

    return new Promise((resolve, reject) => {
      Vue.http.post('https://backend.bikeable.ch/api/v1/register', data)
        .then(response => {
          context.commit('LOAD_FINISH');
          resolve(response);
        }, response => {
          context.commit('LOAD_FINISH');
          reject(response);
        });
    });

  },

  forgottenpw(context, data) {

    context.commit('LOAD_START');

    return new Promise((resolve, reject) => {
      Vue.http.get('https://backend.bikeable.ch/api/v1/forgotpassword/'+data.email)
        .then(response => {
          context.commit('LOAD_FINISH');
          resolve(response);
        }, response => {
          context.commit('LOAD_FINISH');
          reject(response);
        });
    });

  },

  login(context, data) {

    context.commit('LOAD_START');

    return new Promise((resolve, reject) => {
      Vue.http.post('https://backend.bikeable.ch/api/v1/login', data)
        .then(response => {
          context.commit('LOGIN');
          context.commit('LOAD_FINISH');
          localStorage.setItem('token', response.body.data.authToken);
          localStorage.setItem('userId', response.body.data.userId);
          resolve(response);
        }, response => {
          reject(response);
        });
    });

  },

  logout(context) {

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    context.commit('LOAD_START');

    return new Promise((resolve, reject) => {
      Vue.http.post('https://backend.bikeable.ch/api/v1/logout', {}, {
        headers: {
          'X-User-Id': userId,
          'X-Auth-Token': token
        }
      })
        .then(response => {
          context.commit('LOGOUT');
          context.commit('LOAD_FINISH');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          resolve(response);
        }, response => {
          reject(response);
        });
    });

  },

  loadEntries(context) {
    context.commit('LOAD_START');

    Vue.http.get('https://backend.bikeable.ch/api/v1/entries')
      .then(response => {
        console.log(response.body.data);
        context.commit('SET_ENTRIES', response.body.data);
        context.commit('LOAD_FINISH');
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
  isLoggedIn: state => {
    return state.isLoggedIn;
  },
  pending: state => {
    return state.pending;
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
