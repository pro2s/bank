require('dotenv').config();
const server = require('./server');
const path = require('path');
const registration = require('./requests/registration');
const confirm = require('./requests/confirm');
const token = require('./requests/token');
const codegrant = require('./requests/codegrant');
const statment = require('./requests/statment');
const exphbs = require('express-handlebars');
const individual = require('./requests/individual');
const exphbsOptions = {
  defaultLayout: 'main',
  extname: '.html',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  helpers: {}
};

server((app, appUrl) => {
  app.engine('html', exphbs(exphbsOptions));
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));

  // Codegrant handler
  codegrant.init(app, appUrl);

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
    res.render('index', {title: 'Logon'});
  });

  // Individual page
  app.get('/individual', (req, res) => {
    res.render('individual', {title: 'Individual'});
  });

  app.post('/individual', individual);
});
