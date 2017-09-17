import axios from 'axios';

export default {
  register({ email, username, password }) {

    let url = 'https://backend.bikeable.ch/api/v1/register';

    return new Promise((resolve, reject) => {
      axios.post(url, {
        email: email,
        username: username,
        password: password
      })
      .then(response => {
        resolve(response.data.data);
      })
      .catch(error => {
        if(!error.request.response) return;
        let msg = JSON.parse(error.request.response);
        reject(msg.message);
      });
    });

  },

  login({ email, password }) {
    let url = 'https://backend.bikeable.ch/api/v1/login';

    return new Promise((resolve, reject) => {
      axios.post(url, {
        email: email,
        password: password
      })
      .then(response => {
        resolve(response.data.data);
      }, error => {
        if(!error.request.response) return;
        let msg = JSON.parse(error.request.response);
        reject(msg.message);
      });
    });
  },

  logout({ userId, authToken }) {
    let url = 'https://backend.bikeable.ch/api/v1/logout';

    return new Promise((resolve, reject) => {
      axios.post(url, {}, {
        headers: {
          'X-User-Id': userId,
          'X-Auth-Token': authToken
        }
      })
      .then(response => {
        resolve(response.data.data);
      }, response => {
        reject(response.data.message);
      });
    });
  },

  forgottenPassword({ email }) {
    let url = 'https://backend.bikeable.ch/api/v1/forgotpassword/' + email;

    return new Promise((resolve, reject) => {
      axios.get(url)
      .then(response => {
        resolve(response.data);
      }, error => {
        if(!error.request.response) return;
        console.log(error.request);
        let msg = JSON.parse(error.request.response);
        reject(msg.message);
      });
    });
  },

  checkToken({ userId, authToken }) {
    let url = 'https://backend.bikeable.ch/api/v1/tokenvalid';

    return new Promise((resolve, reject) => {
      axios.get(url, {
        headers: {
          'X-User-Id': userId,
          'X-Auth-Token': authToken
        }
      })
      .then(response => {
        resolve(response);
      }, response => {
        reject(response);
      });
    });
  }
}
