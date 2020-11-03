const url = require('url');
const https = require('https');

module.exports = (req, res) => {
    const bankUrl = url.parse(process.env.API_HOST);

    const options = {
      hostname: bankUrl.hostname,
      port: bankUrl.port,
      path: '/individual/1.0.0/accounts/statement',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + req.query.token
      }
    }

    const r = https.request(options, httpsRes => {
      console.log(`statusCode: ${httpsRes.statusCode}`);
      let json = '';
      httpsRes.on('error', function (err) {
        console.log(err);
      })
      httpsRes.on('data', d => json += d);
      httpsRes.on('end', () => {
        try {
          const data = JSON.parse(json);
          return res.status(200).json(data);
        } catch {
          console.log(json);
          return res.status(400).json(json);
        }
      })
    });
    r.on('error', error => {
      console.error(error)
      return res.status(400).json(error);
    });
    r.end();
  }