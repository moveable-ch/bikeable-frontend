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
  },
  SET_SELECTEDCATEGORY(state, selectedCategory){
    state.selectedCategory = selectedCategory;
  }

}

const getters = {
  categories: state => state.categories,
  selectedCategory: state => state.selectedCategory
}

const actions = {
  getCategories({ commit, dispatch, getters }) {

    commit('LOAD_START');
    
    categories.getCategories()
      .then((categories) => {
        commit('LOAD_FINISH');
        commit('SET_CATEGORIES', categories.data);
      },
      (error) => {
        commit('LOAD_FINISH');
        dispatch('handleError', error);
      });
  },
  setSelectedCategory(context, selectedCategory) {
    localStorage.setItem('selectedCategory', selectedCategory);
    context.commit('SET_SELECTEDCATEGORY', selectedCategory);
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
