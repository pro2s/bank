const url = require('url');
const https = require('https');
const querystring = require('querystring');

module.exports = (token, path, params = {}) => {
  const bankUrl = url.parse(process.env.API_HOST);
  const query = querystring.stringify(params);
  const options = {
    hostname: bankUrl.hostname,
    port: bankUrl.port,
    path: path + (query ? '?' + query : ''),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, res => {
      console.log(`${path}: ${res.statusCode}`);
      let json = '';
      res.on('error', err => reject(err));
      res.on('data', data => json += data);
      res.on('end', () => {
        try {
          const result = JSON.parse(json);
          resolve(result);
        } catch {
          reject(json);
        }
      });
    });
    request.on('error', error => {
      console.error(error);
      reject(error);
    });
    request.end();
  });
}
