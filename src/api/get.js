const xml2js = require('xml2js');
const url = require('url');
const https = require('https');
const querystring = require('querystring');
const stripPrefix = require('xml2js').processors.stripPrefix;
const xmlOptons = {
  tagNameProcessors: [ stripPrefix ],
  attrNameProcessors: [ stripPrefix ],
};

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
      let result = '';
      res.on('error', err => reject(err));
      res.on('data', data => result += data);
      res.on('end', async () => {
        if (res.headers['content-type'].includes('application/xml')) {
          const error = await xml2js.parseStringPromise(result, xmlOptons);
          console.log(error);

          return reject(error.fault || {'message': 'XML error'});
        }

        if (res.statusCode !== 200) {
          return reject(JSON.parse(result));
        }

        resolve(JSON.parse(result));
      });
    });
    request.on('error', error => {
      console.error(error);
      reject(error);
    });
    request.end();
  });
}
