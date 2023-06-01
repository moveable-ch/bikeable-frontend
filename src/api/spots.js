import axios from 'axios';

export default {
  getAllSpots({ limit, filter, sort, order, location, region, user, country }) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/entries';
    if (user) url += '?user=' + user;

    let sortParam = sort ? sort : 'votes';
    let orderParam = order ? order : 'descending';
    let filterParam = filter ? filter : null;
    let limitParam = limit ? limit : null;
    let regionParam = region != '' ? region : null;
    let countryParam = country != '' ? (regionParam ? null : country) : null;

    let params = new URLSearchParams();
    if (location) {
      params.append('lat', location.lat);
      params.append('lng', location.lng);
    }

    params.append('sort', sortParam);

    if (limit) params.append('limit', limitParam);
    if (filterParam) {
      if (filterParam.categoryId)
        params.append('categoryId', filterParam.categoryId);
      if (filterParam.type) {
        if (filterParam.type == 'fame') {
          params.append('filter', 'famed');
        } else if (filterParam.type == 'shame') {
          params.append('filter', 'shamed');
        } 
        // else if (filterParam.type == 'archived') {
        //   params.append('archivedOnly', 'true');
        // } 
        else if (filterParam.type == 'fixed') {
          params.append('filter', 'fixed');
        }
      }
    }
    if (region) params.append('region', regionParam);
    if (countryParam) params.append('country', countryParam);

    // console.log(params.toString());

    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params,
        })
        .then(
          (response) => {
            resolve(response.data.data);
          },
          (error) => {
            console.log(error.request);
            if (!error.request.response) reject('');
            let msg = JSON.parse(error.request.response);
            reject(msg.message);
          }
        );
    });
  },
  getLightSpots(filter) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v2/cachedlightentries';
    let filterParam = filter ? filter : null;

    let params = new URLSearchParams();

    if (filterParam) {
      if (filterParam.categoryId) {
        params.append('categoryId', filterParam.categoryId);
      }
      if (filterParam.type) {
        if (filterParam.type == 'fame') {
          params.append('famed', true);
        } else if (filterParam.type == 'shame') {
          params.append('famed', false);
        } else if (filterParam.type == 'fixed') {
          params.append('fixed', true);
        }
      }

      if (filterParam.dateRange) {
        params.append('begin', filterParam.dateRange[0]);
        params.append('end', filterParam.dateRange[1]);
      }
    }

    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params,
        })
        .then(
          (response) => {
            resolve(response.data.data);
          },
          (error) => {
            console.log(error.request);
            if (!error.request.response) reject('');
            let msg = JSON.parse(error.request.response);
            reject(msg.message);
          }
        );
    });
  },
  getMySpots({ limit, filter, sort, order, location }) {
    let userId = localStorage.getItem('userId');
    let authToken = localStorage.getItem('token');

    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/entries';

    let sortParam = sort ? sort : 'votes';
    let orderParam = order ? order : 'descending';
    let filterParam = filter ? filter : null;
    let limitParam = limit ? limit : null;

    let params = new URLSearchParams();

    params.append('sort', sortParam);
    params.append('user', userId);
    if (limit) params.append('limit', limitParam);
    if (filterParam) params.append('filter', filterParam);

    return new Promise((resolve, reject) => {
      axios.get(url, { params: params }).then(
        (response) => {
          resolve(response.data.data);
        },
        (error) => {
          console.log(error.request);
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        }
      );
    });
  },
  getSpotById(spotId) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/entries/' + spotId;

    return new Promise((resolve, reject) => {
      axios.get(url).then(
        (response) => {
          resolve(response.data.data);
        },
        (error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        }
      );
    });
  },

  checkUpvote({ spotId, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/votes/' + spotId;

    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken,
          },
        })
        .then(() => {
          reject();
        })
        .catch((error) => {
          if (error.response.status == 401 || error.response.status == 400) {
            resolve();
          } else {
            reject();
          }
        });
    });
  },

  upvoteSpot({ spotId, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/votes/' + spotId;

    return new Promise((resolve, reject) => {
      axios
        .post(
          url,
          {},
          {
            headers: {
              'X-User-Id': userId,
              'X-Auth-Token': authToken,
            },
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  delayArchiving({ spotId, userId, authToken }) {
    let url =
      process.env.VUE_APP_BACKEND_URL +
      '/api/v1/entries/' +
      spotId +
      '/delayArchiving';

    return new Promise((resolve, reject) => {
      axios
        .post(
          url,
          {},
          {
            headers: {
              'X-User-Id': userId,
              'X-Auth-Token': authToken,
            },
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  proposeFixedSpot({ spotId, userId, authToken }) {
    let url =
      process.env.VUE_APP_BACKEND_URL +
      '/api/v1/entries/' +
      spotId +
      '/proposefixed';

    return new Promise((resolve, reject) => {
      axios
        .post(
          url,
          {},
          {
            headers: {
              'X-User-Id': userId,
              'X-Auth-Token': authToken,
            },
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  addSpot({ data, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/entries';

    // console.log(userId + "      " + authToken);

    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken,
          },
        })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  deleteSpot({ data, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/entries/' + data.id;

    return new Promise((resolve, reject) => {
      axios
        .delete(url, {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken,
          },
        })
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  editSpot({ data, spotId, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + '/api/v1/entries/' + spotId;

    return new Promise((resolve, reject) => {
      axios
        .put(url, data, {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken,
          },
        })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          console.log(error);
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  addPhoto({ data, spotId, userId, authToken }) {
    let url =
      process.env.VUE_APP_BACKEND_URL +
      '/api/v1/entries/' +
      spotId +
      '/addphoto';

    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken,
          },
        })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  addCategory({ spotId, categoryId, userId, authToken }) {
    let url =
      process.env.VUE_APP_BACKEND_URL +
      '/api/v1/entries/' +
      spotId +
      '/addCategory?categoryId=' +
      categoryId;

    return new Promise((resolve, reject) => {
      axios
        .post(url, null, {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken,
          },
        })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  getSpotsByUserId(userId) {
    let url =
      process.env.VUE_APP_BACKEND_URL + '/api/v1/entries?user=' + userId;

    return new Promise((resolve, reject) => {
      axios.get(url).then(
        (response) => {
          resolve(response.data.data);
        },
        (error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        }
      );
    });
  },

  getSpotsCommentedByUserId(userId) {
    let url =
      process.env.VUE_APP_BACKEND_URL +
      '/api/v2/lightentriescommentedby/' +
      userId;

    return new Promise((resolve, reject) => {
      axios.get(url).then(
        (response) => {
          resolve(response.data.data);
        },
        (error) => {
          if (!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        }
      );
    });
  },
};
