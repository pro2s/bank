const express = require('express');
const router = express.Router();
const token = require('../api/token');
const statment = require('../api/individual/accounts/statment');
const { setToken, flash } = require('../lib/session');
const products = require('../api/individual/accounts/products');

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

router.get('/statment', async (req, res, next) => {
  try {
    const token = req.query.token || req.session.token;
    const data = await statment(token);

    res.render('data', {title: 'Statment', data});
  } catch(error) {
    next(error);
  }
});

router.get('/products', async (req, res) => {
    res.render('select', {
      title: 'Select type',
      action: '/individual/products',
      options: ['account', 'deposit', 'card', 'credit']
    });
});

router.post('/products', async (req, res, next) => {
  try {
    const token = req.query.token || req.session.token;

    const data = await products(token, {type: req.body.value});

    res.render('data', {title: 'Products', data, back: true});
  } catch(error) {
    next(error);
  }
});

module.exports = router;
