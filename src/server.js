'use strict';

const app = require('express')();
const url = require('url');

const port = process.env.PRORT || 3000;
const host = process.env.HOST || 'http://www.client.example.com';
const callback = '/callback';
const callbackUrl = url.parse(`${host}:${port}${callback}`);

module.exports = (cb) => {
  app.listen(port, (err) => {
    if (err) return console.error(err);

    console.log(`Express server listening at ${callbackUrl.href}, site ${url.resolve(callbackUrl, '/')}`);

    return cb({
      app,
      callbackUrl: callbackUrl.href,
    });
  });
};