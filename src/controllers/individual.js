const express = require('express');
const router = express.Router();
const token = require('../api/token');
const statment = require('../api/individual/accounts/statment');
const { setToken, flash } = require('../lib/session');

router.get('/login', async (req, res) => {
  res.render('login', {title: 'Login'});
});

router.post('/login', async (req, res) => {
  const credentials = {
    login: req.body.login || null,
    password: req.body.password || null,
  };

  const tokenResult = await token(credentials);
  setToken(req, tokenResult, 'individual');
  flash(req, 'Login sucessful');

  res.redirect('/individual/statment');
});

router.get('/statment', async (req, res) => {
  try {
    const token = req.query.token || req.session.token;
    const data = await statment(token);

    res.render('data', {title: 'Logon', data: JSON.stringify(data, null, 2)});
  } catch(error) {
    return res.status(500).json(error.message || error);
  }
});

module.exports = router;
