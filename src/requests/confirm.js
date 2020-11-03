const url = require('url');
const https = require('https');
const confirmSms = 'Undefined';

// Can be generated
const userLogin = 'Undefined';

// Can be generated https://click.alfa-bank.by/webBank2/helpNew/security.xhtml
const userPassword = 'Undefined';

module.exports = (req, res) => {

    const data = JSON.stringify({
      sms: process.env.DEBUG ? '1111' : confirmSms,
      login: process.env.DEBUG ? 'API' : userLogin,
      password: process.env.DEBUG ? 'P@ssword0!' : userPassword,
      deviceId: process.env.KSUID,
      approve: true,
    })

    const bankUrl = url.parse(process.env.API_HOST);

    const options = {
      hostname: bankUrl.hostname,
      port: bankUrl.port,
      path: '/individual/1.0.0/registration/confirmRegistration',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const r = https.request(options, httpsRes => {
      console.log(`statusCode: ${httpsRes.statusCode}`);
      let json = '';
      httpsRes.on('error', function (err) {
        console.log(err);
      });
      httpsRes.on('data', d => json += d);
      httpsRes.on('end', () => {
        const data = JSON.parse(json);
        console.log(data);
        return res.status(200).json(data);
      })
    });
    r.on('error', error => {
      console.error(error)
      return res.status(400).json(error);
    });
    r.write(data)
    r.end();
  }