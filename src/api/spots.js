import axios from 'axios';
var config = require('../../config');


export default {
  getAllSpots( { limit, filter, sort, order, location } ) {
    let url =  process.env.BACKEND_URL + '/api/v1/entries';

    let sortParam = sort ? sort : 'votes';
    let orderParam = order ? order : 'descending';
    let filterParam = filter ? filter : null;
    let limitParam = limit ? limit : null;

    let params = new URLSearchParams();
    if(location) {
      params.append('lat', location.lat);
      params.append('lng', location.lng);
    }

    params.append('sort', sortParam);
    if(limit) params.append('limit', limitParam);
    if(filterParam) params.append('filter', filterParam);

    // console.log(params.toString());

    return new Promise((resolve, reject) => {
      axios.get(url, {
          params: params
        })
        .then(response => {
          resolve(response.data.data);
        }, error => {
          console.log(error.request);
          if(!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  getSpotById(spotId) {
    let url = process.env.BACKEND_URL + '/api/v1/entries/' + spotId;

    return new Promise((resolve, reject) => {
      axios.get(url)
        .then(response => {
          resolve(response.data.data);
        }, error => {
          if(!error.request.response) reject('');
          let msg = JSON.parse(error.request.response);
          reject(msg.message);
        });
    });
  },

  checkUpvote({ spotId, userId, authToken }) {

    let url = process.env.BACKEND_URL + '/api/v1/votes/' + spotId;

    return new Promise((resolve, reject) => {
      axios.get(url,
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken
          }
        })
        .then(
          () => {
            reject();
          }
        )
        .catch(
          (error) => {
            if(error.response.status == 401 || error.response.status == 400) {
              resolve();
            }else{
              reject();
            }
          }
        );
    });
  },

  upvoteSpot({ spotId, userId, authToken }) {

    let url = process.env.BACKEND_URL + '/api/v1/votes/' + spotId;

    return new Promise((resolve, reject) => {
      axios.post(url, {},
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken
          }
        })
        .then(
          (response) => {
            resolve(response.data);
          }
        )
        .catch(
          (error) => {
            if(!error.request.response) reject('');
            let msg = JSON.parse(error.request.response);
            reject(msg.message);
          }
        );
    });
  },

  addSpot({ data, userId, authToken}) {

    let url = process.env.BACKEND_URL + '/api/v1/entries'

    return new Promise((resolve, reject) => {
      axios.post(url, data,
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken
          }
        })
        .then(
          (response) => {
            resolve(response.data.data);
          }
        )
        .catch(
          (error) => {
            if(!error.request.response) reject('');
            let msg = JSON.parse(error.request.response);
            reject(msg.message);
          }
        );
    });

  },

  editSpot({ data, spotId, userId, authToken}) {

    let url = process.env.BACKEND_URL + '/api/v1/entries/'+ spotId

    return new Promise((resolve, reject) => {
      axios.put(url, data,
        {
          headers: {
            'X-User-Id': userId,
            'X-Auth-Token': authToken
          }
        })
        .then(
          (response) => {
            resolve(response.data.data);
          }
        )
        .catch(
          (error) => {
            console.log(error);
            if(!error.request.response) reject('');
            let msg = JSON.parse(error.request.response);
            reject(msg.message);
          }
        );
    });

  }
}
