require('dotenv').config()
const server = require('./server');
const { AuthorizationCode } = require('simple-oauth2');

server(({ app, callbackUrl }) => {
    const config = {
        client: {
          id: process.env.CLIENT,
          secret: process.env.SECRET
        },
        auth: {
          tokenHost: process.env.API_HOST
        }
    };
    console.log('Start', process.env.CLIENT);
    
    const client = new AuthorizationCode(config);
  
    const authorizationUri = client.authorizeURL({
      redirect_uri: 'http://localhost:3000/callback',
      scope: 'accounts',
      state: '1'
    });
  
    // Initial page redirecting to Bank
    app.get('/auth', (req, res) => {
        console.log(authorizationUri);
        res.redirect(authorizationUri);
    });
  
    // Callback service parsing the authorization token and asking for the access token
    app.get('/callback', async (req, res) => {
        const { code } = req.query;
        const options = {
        code,
        };

        try {
          const accessToken = await client.getToken(options);

            console.log('The resulting token: ', accessToken.token);

            return res.status(200).json(accessToken.token);
        } catch (error) {
            console.error('Access Token Error', error.message);
            return res.status(500).json('Authentication failed');
        }
    });

    app.get('/', (req, res) => {
        res.send('Hello<br><a href="/auth">Log in with Bank</a>');
    });
});   