import categories from '../../api/categories';

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
  },
  SET_CATEGORIES(state, cats) {
    state.categories = cats;
  }
}


const getters = {
  categories: state => state.categories
}

const actions = {
  getCategories({ commit, dispatch, getters }) {

    commit('LOAD_START');
    
    categories.getCategories()
      .then((categories) => {
        commit('LOAD_FINISH');
        commit('SET_CATEGORIES', categories.data);
        console.log(categories.data);
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
