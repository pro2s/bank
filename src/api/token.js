const post = require('./post');
const querystring = require('querystring');

module.exports = async (credentials) => {
  if (process.env.DEBUG) {
    credentials = {
      login: 'API',
      password: 'P@ssword0!'
    };
  }

  const data = querystring.stringify({
    grant_type: 'password',
    client_id: process.env.CLIENT,
    client_secret: process.env.SECRET,
    scope: 'accounts_individual',
    source: 'individual',
    username: credentials.login,
    password: credentials.password,
  });

  const result = await post(
    '/token',
    'application/x-www-form-urlencoded',
    data,
  );

  return JSON.parse(result);
}
