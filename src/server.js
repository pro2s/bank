'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const url = require('url');
const ngrok = require('./lib/ngrok');

const app = express();
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
}));

const port = process.env.PORT || 3000;

const getBaseUrl = (port) => {
  if (process.env.PRODUCTION_URL) {
    return process.env.PRODUCTION_URL;
  } else {
    const host = process.env.HOST || 'http://www.client.example.com';
    return url.parse(`${host}:${port}`);
  }
};

const baseUrl = getBaseUrl(port);

const listener = (appUrl, init) => app.listen(port, (err) => {
  if (err) return console.error(err);
  console.log('Start server: ', url.resolve(appUrl, '/'));

  return init(app, appUrl);
});

module.exports = async (init) => {
  try {
    const publicUrl = await ngrok.getPublicUrl();
    console.log('Start ngrok on ', publicUrl);

    listener(publicUrl, init);
  } catch (error) {
    console.log('Can not connect to ngrok server. Is it running?');


    listener(baseUrl, init);
  }
};
