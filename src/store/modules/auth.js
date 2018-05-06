import auth from '../../api/auth';

const state = {
  isLoggedIn: !!localStorage.getItem('token')
}

const getters = {
  isLoggedIn: state => state.isLoggedIn
}

const actions = {

  fblogin({ commit, dispatch }, { accessToken, email, name }) {

    commit('LOAD_START');

    return new Promise((resolve, reject) => {
      auth.login(
        {
          accessToken: accessToken, 
          email: email, 
          name: name
        }
      )
      .then((data) => {
        commit('LOGIN');
        commit('LOAD_FINISH');
        localStorage.setItem('token', data.authToken);
        localStorage.setItem('userId', data.userId);

        dispatch('getUserData');
        resolve(data);
      },
      (error) => {
        commit('LOAD_FINISH');
        dispatch('handleError', error);
        reject(error);
      });
    });

  },

  register({ commit, dispatch }, { email, username, password }) {

    commit('LOAD_START');

    return new Promise((resolve, reject) => {
      auth.register(
        {
          email: email,
          username: username,
          password: password
        }
      )
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

  forgottenPassword({ commit, dispatch }, { email }) {

    commit('LOAD_START');

    return new Promise((resolve, reject) => {
      auth.forgottenPassword(
        {
          email: email
        }
      )
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

  login({ commit, dispatch }, { email, password }) {

    commit('LOAD_START');

    return new Promise((resolve, reject) => {
      auth.login(
        {
          email: email,
          password: password
        }
      )
      .then((data) => {
        commit('LOGIN');
        commit('LOAD_FINISH');
        localStorage.setItem('token', data.authToken);
        localStorage.setItem('userId', data.userId);

        dispatch('getUserData');
        resolve(data);
      },
      (error) => {
        commit('LOAD_FINISH');
        dispatch('handleError', error);
        reject(error);
      });
    });

  },

  logout({ commit, dispatch }) {

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    commit('LOAD_START');

    return new Promise((resolve, reject) => {
      auth.logout({
          userId: userId,
          authToken: token
        })
        .then(response => {
          commit('LOAD_FINISH');
          commit('LOGOUT');
          commit('SET_USER_DATA', null);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          resolve(response);
        }, response => {
          commit('LOAD_FINISH');
          reject(response);
        });
    });

  },

  checkToken({ commit, dispatch }) {

    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('token');

    commit('LOAD_START');

    return new Promise((resolve, reject) => {
      auth.checkToken({
          userId: userId,
          authToken: token
        })
        .then(response => {
          commit('LOAD_FINISH');
          dispatch('getUserData');
          resolve(response);
        }, response => {
          commit('LOAD_FINISH');
          commit('LOGOUT');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          reject(response);
        });
    });

  }
}

const mutations = {
  LOGIN(state) {
    state.isLoggedIn = true;
  },
  LOGOUT(state) {
    state.isLoggedIn = false;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
