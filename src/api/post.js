const url = require('url');
const https = require('https');
const bankUrl = url.parse(process.env.API_HOST);

module.exports = (path, type, data) => {
  const options = {
    hostname: bankUrl.hostname,
    port: bankUrl.port,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': type,
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, res => {
      console.log(`${path}: ${res.statusCode}`);
      let result = '';
      res.on('error', err => reject(err));
      res.on('data', data => result += data);
      res.on('end', () => resolve(result));
    });
    request.on('error', err => {
      console.error(error);
      reject(err);
    });
    request.write(data);
    request.end();
  });
};
