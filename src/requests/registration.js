const url = require('url');
const https = require('https');
const personId = 'Undefined';

module.exports = (req, res) => {
    const data = JSON.stringify({
      personId: process.env.DEBUG ? 'TEST' : personId,
      deviceId: process.env.KSUID,
      isResident: true,
    })

    const bankUrl = url.parse(process.env.API_HOST);

    const options = {
      hostname: bankUrl.hostname,
      port: bankUrl.port,
      path: '/individual/1.0.0/registration/registration',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const r = https.request(options, httpsRes => {
      console.log(`statusCode: ${httpsRes.statusCode}`);
      let json = '';
      httpsRes.on('data', d => json += d);
      httpsRes.on('end', () => {
        const data = JSON.parse(json);
        data.deviceId = process.env.KSUID;
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