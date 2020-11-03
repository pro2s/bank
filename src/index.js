require('dotenv').config();
const server = require('./server');
const registration = require('./requests/registration');
const confirm = require('./requests/confirm');
const token = require('./requests/token');
const codegrant = require('./requests/codegrant');
const statment = require('./requests/statment');

server((app, appUrl) => {
  // Codegrant handler
  codeGrant.init(app, appUrl);

  // Registration page
  app.get('/register', registration);

  // Confirm registration page
  app.get('/confirm', confirm);

  // Token page
  app.get('/token', token);

  // Statment page
  app.get('/stat', statment);

  // Index page
  app.get('/', (req, res) => {
    res.send('Hello<br><a href="/auth">Log in with Bank</a>');
  });

});
