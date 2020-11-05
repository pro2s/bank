const express = require('express');
const router = express.Router();
const confirm = require('../api/confirm');
const token = require('../api/token');

router.get('/', (req, res) => {
  res.render('confirm', {title: 'Confirm registration'});
});

router.post('/', async (req, res) => {
  try {
    // TODO: Register user with credentials by req.body.email

    // Optional
    const credentials = {
      login: req.body.login || null,
      password: req.body.password || null,
    }

    const result = await confirm(req.body.sms || '');
    req.session.flash.push(result);

    const tokenResult = await token(credentials);
    req.session.token = tokenResult.access_token;

    res.redirect('/statment');
  } catch (error) {
    res.status(500).json(error.message || error);
  }
});

module.exports = router;
