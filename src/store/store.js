import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(VueResource)

const state = {
  isLoggedIn: !!localStorage.getItem('token'),
  pending: false,
  entries: false,
  sponsors: false,
  userCoords: false,
  msg: '',
  sort: 'shame'
}

const mutations = {
  SET_ENTRY_SORTING(state, sort) {
    state.sort = sort;
  },
  SET_MESSAGE(state, msg) {
    state.msg = msg;

    setTimeout(function() {
      state.msg = '';
    }.bind(this), 2000);
  },
  LOAD_START(state) {
    state.pending = true;
  },
  LOAD_FINISH(state) {
    state.pending = false;
  },
  SET_ENTRIES(state, entries) {
    state.entries = entries;
  },
  SET_SPONSORS(state, sponsors) {
    state.sponsors = sponsors;
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
          context.commit('LOAD_FINISH');
          reject(response);
        });
    });

  },

  checkToken(context) {

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    return new Promise((resolve, reject) => {
      Vue.http.get('https://backend.bikeable.ch/api/v1/tokenvalid', {
        headers: {
          'X-User-Id': userId,
          'X-Auth-Token': token
        }
      })
        .then(response => {
          // console.log(response);
          context.commit('LOAD_FINISH');
          resolve(response);
        }, response => {
          // context.dispatch('handleError', response.body.message);
          context.commit('LOAD_FINISH');
          context.commit('LOGOUT');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
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
          context.commit('LOAD_FINISH');
          context.commit('LOGOUT');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          resolve(response);
        }, response => {
          context.commit('LOAD_FINISH');
          reject(response);
        });
    });

  },

  uploadImage(context, data) {

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    context.commit('LOAD_START');

    return new Promise((resolve, reject) => {
      Vue.http.post('https://backend.bikeable.ch/api/v1/photos', data, {
        headers: {
          'X-User-Id': userId,
          'X-Auth-Token': token
        }
      })
        .then(response => {
          context.commit('LOAD_FINISH');
          resolve(response);
        }, response => {
          reject(response);
        });
    });

  },

  postEntry(context, data) {

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    context.commit('LOAD_START');

    return new Promise((resolve, reject) => {
      Vue.http.post('https://backend.bikeable.ch/api/v1/entries', data, {
        headers: {
          'X-User-Id': userId,
          'X-Auth-Token': token
        }
      })
        .then(response => {
          context.commit('LOAD_FINISH');
          resolve(response);
        }, response => {
          context.commit('LOAD_FINISH');
          this.$store.dispatch('handleError', 'Fehler');
          reject(response);
        });
    });

  },

  loadEntries(context) {
    context.commit('LOAD_START');

    let url = 'https://backend.bikeable.ch/api/v1/entries';
    if(context.state.sort == 'location' && context.state.userCoords) {
      let coords = context.state.userCoords;
      let params = '?sort=distance&lat=' + coords.lat + '&lng=' + coords.lng;
      url = url + params;
    }

    Vue.http.get(url)
      .then(response => {
        context.commit('SET_ENTRIES', response.body.data);
        context.commit('LOAD_FINISH');
      }, response => {
        context.commit('LOAD_FINISH');
        this.$store.dispatch('handleError', response.body.message);
        console.log(response);
      });
  },

  loadSponsors(context) {

    context.commit('LOAD_START');

    let url = 'https://backend.bikeable.ch/api/v1/sponsoredEntries';

    Vue.http.get(url)
      .then(response => {
        context.commit('SET_SPONSORS', response.body.data);
        context.commit('LOAD_FINISH');
      }, response => {
        context.commit('LOAD_FINISH');
        this.$store.dispatch('handleError', response.body.message);
        console.log(response);
      });

  },

  setEntrySorting(context, sort) {
    if(sort != 'location' && sort != 'fame' && sort != 'shame') return;

    if(context.state.sort != sort) {
      context.commit('SET_ENTRY_SORTING', sort);
      context.dispatch('loadEntries');
    }
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
  },

  handleError(context, msg) {
    context.commit('SET_MESSAGE', msg);
  }
}

const getters = {
  isLoggedIn: state => {
    return state.isLoggedIn;
  },
  pending: state => {
    return state.pending;
  },
  msg: state => {
    return state.msg;
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
