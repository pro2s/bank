const flash = (req, message, type = 'success') => {
    req.session.flash.push({message, type});
};
const setToken = (req, token, type) => {
  req.session.token = token.access_token;
  req.session.tokenType = type;
};

const clearToken = req => {
    req.session.token = null;
    req.session.tokenType = null;
};

const sessionMidleware = (app) => (req, res, next) => {
  if (!req.session.flash) {
    req.session.flash = [];
  } else {
    app.locals.flash = req.session.flash;
    req.session.flash = [];
  }
  app.locals.path = req.path;
  app.locals.token = !!req.session.token;
  app.locals.partner = req.session.tokenType === 'partner';
  app.locals.individual = req.session.tokenType === 'individual';
  app.locals.debug = !!process.env.DEBUG;

  next();
};

module.exports = {
    sessionMidleware,
    setToken,
    clearToken,
    flash
};
