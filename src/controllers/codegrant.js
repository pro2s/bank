const { AuthorizationCode } = require('simple-oauth2');
const express = require('express');
const router = express.Router();
const url = require('url');
const { setToken } = require('../lib/session');
const callback = '/callback';

const config = {
  client: {
    id: process.env.CLIENT,
    secret: process.env.SECRET
  },
  auth: {
    tokenHost: process.env.API_HOST,
    tokenPath: '/token',
    authorizePath: '/authorize'
  }
};

const client = new AuthorizationCode(config);
const getAuthorizationUri = (redirect_uri) => client.authorizeURL({
  redirect_uri,
  scope: 'profile accounts',
  state: '1',
});
const getTokenOptions = (code, redirect_uri) => ({code, redirect_uri});

module.exports.init = (appUrl) => {
  // Callback service parsing the authorization token and asking for the access token
  const redirectUri = url.resolve(appUrl, callback);

  // Initial page redirecting to Bank
  router.get('/auth', (req, res) =>  res.redirect(getAuthorizationUri(redirectUri)));

  router.get(callback, async (req, res, next) => {
    const { code } = req.query;

    try {
      const { token } = await client.getToken(getTokenOptions(code, redirectUri));

      setToken(req, token, 'partner');

      res.redirect('/partner/statment');
    } catch (error) {
      console.error('Access Token Error', error.message);
      next(error);
    }
  });

  return router;
};
