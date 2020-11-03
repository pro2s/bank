const url = require('url');
const https = require('https');
const querystring = require('querystring');
const userLogin = 'Undefined';
const userPassword = 'Undefined';

module.exports = (req, res) => {
    const data = querystring.stringify({
        grant_type: 'password',
        username: process.env.DEBUG ? 'API' : userLogin,
        password: process.env.DEBUG ? 'P@ssword0!' : userPassword,
        client_id: process.env.CLIENT,
        client_secret: process.env.SECRET,
        scope: 'accounts_individual',
        source: 'individual'
    })

    const bankUrl = url.parse(process.env.API_HOST);

    const options = {
      hostname: bankUrl.hostname,
      port: bankUrl.port,
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
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
        const data = JSON.parse(json);
        console.log(data);
        return res.status(200).send(querystring.escape(data.access_token));
      })
    });
    r.on('error', error => {
      console.error(error)
      return res.status(400).json(error);
    });
    r.write(data)
    r.end();
  }