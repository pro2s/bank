require('dotenv').config();
const server = require('./server');
const path = require('path');
const registration = require('./controllers/registration');
const confirm = require('./controllers/confirm');
const codegrant = require('./controllers/codegrant');
const statment = require('./controllers/statment');
const exphbs = require('express-handlebars');

const exphbsOptions = {
  defaultLayout: 'main',
  extname: '.html',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
};

server((app, appUrl) => {
  app.use((req, res, next) => {
    if (!req.session.flash) {
      req.session.flash = [];
    } else {
      app.locals.flash = req.session.flash;
      req.session.flash = [];
    }

    next();
  });

  app.engine('html', exphbs(exphbsOptions));
  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, 'views'));

  // Index page
  app.get('/', (req, res) => {
    res.render('index', {title: 'Logon'});
  });

  // Codegrant handler
  codegrant.init(app, appUrl);

  app.use('/confirm', confirm);

  app.use('/registration', registration);

  // Statment page
  app.get('/statment', statment);
});
