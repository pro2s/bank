const { AuthorizationCode } = require('simple-oauth2');
const url = require('url');
const callback = '/callback';

module.exports.init = (app, appUrl) => {
  // Callback service parsing the authorization token and asking for the access token
  const config = {
    client: {
      id: process.env.CLIENT,
      secret: process.env.SECRET
    },
    auth: {
      tokenHost: process.env.API_HOST
    }
  };

  const client = new AuthorizationCode(config);

  const authorizationUri = client.authorizeURL({
    redirect_uri: url.resolve(appUrl, callback),
    scope: 'accounts',
    state: '1'
  });

  // Initial page redirecting to Bank
  app.get('/auth', (req, res) => {
    console.log(authorizationUri);

    res.redirect(authorizationUri);
  });

  app.get('/callback', async (req, res) => {
    const { code } = req.query;
    const options = { code };

    try {
      const accessToken = await client.getToken(options);

      console.log('The resulting token: ', accessToken.token);

      return res.status(200).json(accessToken.token);
    } catch (error) {
      console.error('Access Token Error', error.message);
      return res.status(500).json('Authentication failed');
    }
  });
}
