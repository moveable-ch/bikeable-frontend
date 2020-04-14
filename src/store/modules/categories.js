import regions from '../../api/categories';

const state = {
  categories: [],
  pending: false
}

const mutations = {
  LOAD_START(state) {
    state.pending = true;
  },
  LOAD_FINISH(state) {
    state.pending = false;
  }
}


const getters = {
  tags: state => state.tags
}

const actions = {
  getCategories({ commit, dispatch, getters }) {

    commit('LOAD_START');
    
    categories.getCategories()
      .then((tags) => {
        commit('LOAD_FINISH');
        commit('SET_TAGS', tags);
      },
      (error) => {
        commit('LOAD_FINISH');
        dispatch('handleError', error);
      });
  },
}

export default {
  state,
  mutations,
  getters,
  actions
}
