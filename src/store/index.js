import Vue from 'vue'
import Vuex from 'vuex'

import map from './modules/map'
import spots from './modules/spots'
import auth from './modules/auth'
import users from './modules/users'
import images from './modules/images'

Vue.use(Vuex)

const state = {
  pending: false,
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
  }
}

const actions = {

  setEntrySorting(context, sort) {
    if(sort != 'location' && sort != 'fame' && sort != 'shame') return;

    if(context.state.sort != sort) {
      context.commit('SET_ENTRY_SORTING', sort);
      context.dispatch('loadEntries');
    }
  },

  handleError(context, msg) {
    context.commit('SET_MESSAGE', msg);
  }
}

const getters = {
  pending: state => {
    return state.pending;
  },
  msg: state => {
    return state.msg;
  }
}

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    auth,
    spots,
    map,
    users,
    images
  }
})
