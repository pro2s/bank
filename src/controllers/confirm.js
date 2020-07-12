const express = require('express');
const router = express.Router();
const confirm = require('../api/confirm');
const token = require('../api/token');
const { setToken, flash } = require('../lib/session');

router.get('/', (req, res) => {
  res.render('confirm', {title: 'Confirm registration'});
});

router.post('/', async (req, res, next) => {
  try {
    // TODO: Register user with credentials by req.body.email

    // Optional
    const credentials = {
      login: req.body.login || null,
      password: req.body.password || null,
    };

    const result = await confirm(req.body.sms || '');
    flash(req, result.message);

    const tokenResult = await token(credentials);
    setToken(req, tokenResult);

    res.redirect('/individual/statment');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
