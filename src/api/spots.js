import axios from 'axios';

export default {
  getAllSpots({ limit, filter, sort, order, location, region }) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/entries";

    let sortParam = sort ? sort : "votes";
    let orderParam = order ? order : "descending";
    let filterParam = filter ? filter : null;
    let limitParam = limit ? limit : null;
    let regionParam = region != "" ? region : null;

    let params = new URLSearchParams();
    if (location) {
      params.append("lat", location.lat);
      params.append("lng", location.lng);
    }

    params.append("sort", sortParam);
    if (limit) params.append("limit", limitParam);
    if (filterParam) params.append("filter", filterParam);
    if (region) params.append("region", regionParam);

    // console.log(params.toString());

    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          params: params
        })
        .then(
          (response) => {
            resolve(response.data.data);
          },
          (error) => {
            console.log(error.request);
            if (!error.request.response) reject("");
            let msg = JSON.parse(error.request.response);
            reject(msg.message);
          }
        );
    });
  },
  getLightSpots({ limit, filter, sort, order, location }) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v2/cachedlightentries";

    return new Promise((resolve, reject) => {
      axios.get(url, {}).then(
        (response) => {
          resolve(response.data.data);
        },
        (error) => {
          console.log(error.request);
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        }
      );
    });
  },
  getMySpots({ limit, filter, sort, order, location }) {
    let userId = localStorage.getItem("userId");
    let authToken = localStorage.getItem("token");

    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/entries";

    let sortParam = sort ? sort : "votes";
    let orderParam = order ? order : "descending";
    let filterParam = filter ? filter : null;
    let limitParam = limit ? limit : null;

    let params = new URLSearchParams();

    params.append("sort", sortParam);
    params.append("user", userId);
    if (limit) params.append("limit", limitParam);
    if (filterParam) params.append("filter", filterParam);

    return new Promise((resolve, reject) => {
      axios.get(url, { params: params }).then(
        (response) => {
          resolve(response.data.data);
        },
        (error) => {
          console.log(error.request);
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        }
      );
    });
  },
  getSpotById(spotId) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/entries/" + spotId;

    return new Promise((resolve, reject) => {
      axios.get(url).then(
        (response) => {
          resolve(response.data.data);
        },
        (error) => {
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        }
      );
    });
  },

  checkUpvote({ spotId, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/votes/" + spotId;

    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: {
            "X-User-Id": userId,
            "X-Auth-Token": authToken
          }
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
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/votes/" + spotId;

    return new Promise((resolve, reject) => {
      axios
        .post(
          url,
          {},
          {
            headers: {
              "X-User-Id": userId,
              "X-Auth-Token": authToken
            }
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  proposeFixedSpot({ spotId, userId, authToken }) {
    let url =
      process.env.VUE_APP_BACKEND_URL + "/api/v1/entries/" + spotId + "/proposefixed";

    return new Promise((resolve, reject) => {
      axios
        .post(
          url,
          {},
          {
            headers: {
              "X-User-Id": userId,
              "X-Auth-Token": authToken
            }
          }
        )
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  addSpot({ data, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/entries";

    console.log(userId + "      " + authToken);

    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: {
            "X-User-Id": userId,
            "X-Auth-Token": authToken
          }
        })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  deleteSpot({ data, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/entries/" + data.id;

    return new Promise((resolve, reject) => {
      axios
        .delete(url, {
          headers: {
            "X-User-Id": userId,
            "X-Auth-Token": authToken
          }
        })
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  editSpot({ data, spotId, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/entries/" + spotId;

    return new Promise((resolve, reject) => {
      axios
        .put(url, data, {
          headers: {
            "X-User-Id": userId,
            "X-Auth-Token": authToken
          }
        })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          console.log(error);
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  addPhoto({ data, spotId, userId, authToken }) {
    let url =
      process.env.VUE_APP_BACKEND_URL + "/api/v1/entries/" + spotId + "/addphoto";

    return new Promise((resolve, reject) => {
      axios
        .post(url, data, {
          headers: {
            "X-User-Id": userId,
            "X-Auth-Token": authToken
          }
        })
        .then((response) => {
          resolve(response.data.data);
        })
        .catch((error) => {
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  getSpotsByUserId(userId) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/entries?user=" + userId;

    return new Promise((resolve, reject) => {
      axios.get(url).then(
        (response) => {
          resolve(response.data.data);
        },
        (error) => {
          if (!error.request.response) reject("");
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        }
      );
    });
  }
};
