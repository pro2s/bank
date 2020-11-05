'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const url = require('url');
const ngrok = require('./lib/ngrok');

const app = express();
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
}));

const port = process.env.PRORT || 3000;
const host = process.env.HOST || 'http://www.client.example.com';
const baseUrl = url.parse(`${host}:${port}`);

const listener = (appUrl, init) => app.listen(port, (err) => {
  if (err) return console.error(err);
  console.log('Set the new webhook to"', appUrl, '" server: ', url.resolve(appUrl, '/'));

  return init(app, appUrl);
});

module.exports = async (init) => {
  try {
    const publicUrl = await ngrok.getPublicUrl();
    console.log('Set the new webhook to"', publicUrl);

    listener(publicUrl, init);
  } catch (error) {
    console.log('Can not connect to ngrok server. Is it running?');


    listener(baseUrl, init);
  }
};
