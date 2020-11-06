require('dotenv').config();
const server = require('./server');
const path = require('path');
const registration = require('./controllers/registration');
const confirm = require('./controllers/confirm');
const codegrant = require('./controllers/codegrant');
const individual = require('./controllers/individual');
const partner = require('./controllers/partner');
const exphbs = require('express-handlebars');
const { sessionMidleware, clearToken, flash } = require('./lib/session');

const exphbsOptions = {
  defaultLayout: 'main',
  extname: '.html',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: [
    path.join(__dirname, 'views', 'partials'),
  ],
  helpers: {
    'json': (data) => JSON.stringify(data, null, 2),
  }
};

server((app, appUrl) => {
  app.use(sessionMidleware(app));

  app.engine('html', exphbs(exphbsOptions));
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));

  app.get('/', (req, res) => res.render('index', {title: 'Logon'}));

  app.get('/token', (req, res) => res.render('data', {title: 'Token', data: req.session.token}));

  app.get('/logout', async (req, res) => {
    flash(req, 'Logout complete.');
    clearToken(req);
    res.redirect('/');
  });

  app.use('/', codegrant.init(appUrl));

  app.use('/confirm', confirm);

  app.use('/registration', registration);

  app.use('/individual', individual);

  app.use('/partner', partner);

  app.use((err, req, res, next) => {
    if (req.xhr) {
      res.status(500).send(err);
    } else {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    let message = err;

    if (err.message instanceof Array) {
      message = err.message.join('\n');
    } else if (err.message) {
      message = err.message;
    }

    res.render('error', {title: 'Error', message});
  });
});
