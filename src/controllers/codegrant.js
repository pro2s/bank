const { AuthorizationCode } = require('simple-oauth2');
const express = require('express');
const router = express.Router();
const url = require('url');
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

module.exports.init = (appUrl) => {
  // Callback service parsing the authorization token and asking for the access token
  const redirectUri = url.resolve(appUrl, callback);

  // Initial page redirecting to Bank
  router.get('/auth', (req, res) => {
    res.redirect(getAuthorizationUri(redirectUri));
  });

  router.get(callback, async (req, res) => {
    const { code } = req.query;
    const options = { code, redirect_uri: redirectUri };

    try {
      const { token } = await client.getToken(options);

      console.log('The resulting token: ', token);

      req.session.token = token.access_token;

      res.redirect('/partner/statment');
    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });

  return router;
}
