'use strict';

const app = require('express')();
const url = require('url');
const ngrok = require('./lib/ngrok');

const port = process.env.PRORT || 3000;
const host = process.env.HOST || 'http://www.client.example.com';
const callback = '/callback';
const baseUrl = url.parse(`${host}:${port}${callback}`);
const listener = (callbackUrl, cb) => {
  app.listen(port, (err) => {
    if (err) return console.error(err);
    console.log('Set the new webhook to"', callbackUrl, '" server: ', url.resolve(callbackUrl, '/'));
    return cb({
      app,
      callbackUrl,
    });
  });
};

module.exports = (cb) => {
  return ngrok.getPublicUrl().then(publicUrl => {
    console.log('Set the new webhook to"', publicUrl);

    listener(url.resolve(publicUrl, callback), cb);
  }).catch(error => {
    console.log('Can not connect to ngrok server. Is it running?');

    listener(baseUrl, cb);
  });
};