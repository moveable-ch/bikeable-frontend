import axios from 'axios';

export default {
  getSponsoredEntries() {
    let url = 'https://backend.bikeable.ch/api/v1/sponsoredEntries';

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
  }
}
