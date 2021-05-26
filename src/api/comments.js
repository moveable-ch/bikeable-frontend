import axios from "axios";

export default {
  getCommentsBySpot(spotId) {
    let url =
      process.env.VUE_APP_BACKEND_URL + "/api/v1/comments?entry=" + spotId;

    return new Promise((resolve, reject) => {
      axios.get(url).then(
        response => {
          resolve(response.data.data);
        },
        response => {
          reject(response.data.message);
        }
      );
    });
  },

  postComment({ entryId, comment, userId, authToken }) {
    let url = process.env.VUE_APP_BACKEND_URL + "/api/v1/comments";

    return new Promise((resolve, reject) => {
      axios
        .post(
          url,
          {
            entryId: entryId,
            text: comment,
            user: {
              _id: userId
            }
          },
          {
            headers: {
              "X-User-Id": userId,
              "X-Auth-Token": authToken
            }
          }
        )
        .then(response => {
          resolve(response.data.data);
        })
        .catch(response => {
          if (!response.data) return;
          reject(response.data.message);
        });
    });
  },

  updateComment({ commentId, comment, userId, authToken }) {
    let url = `${process.env.VUE_APP_BACKEND_URL}/api/v1/comments/${commentId}`;

    console.log(url, comment, userId, authToken);
    return new Promise((resolve, reject) => {
      axios
        .put(
          url,
          {
            text: comment
          },
          {
            headers: {
              "X-User-Id": userId,
              "X-Auth-Token": authToken
            }
          }
        )
        .then(response => {
          resolve(response.data.data);
        })
        .catch(e => {
          reject(e);
        });
    });
  }
};
