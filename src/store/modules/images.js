import images from '../../api/images';

const state = {
}

const getters = {
}

const actions = {
  uploadImage({ commit, dispatch }, data) {

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    commit('LOAD_START');

    return new Promise((resolve, reject) => {
      images.uploadImage({
          userId: userId,
          authToken: token,
          data: data
        })
        .then((data) => {
          commit('LOAD_FINISH');
          resolve(data);
        },
        (error) => {
          commit('LOAD_FINISH');
          dispatch('handleError', error);
          reject(error);
        }
      );
    });

  }
}

const mutations = {
}

export default {
  state,
  getters,
  actions,
  mutations
}
