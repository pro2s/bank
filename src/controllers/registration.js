const express = require('express');
const router = express.Router();
const registration = require('../api/registration');
const { flash } = require('../lib/session');
router.get('/', (req, res) => {
  res.render('registration', {title: 'Individual registration'});
});

router.post('/', async (req, res) => {
  const person = {
    personId: req.body.id || null,
    isResident: req.body.resident === 'on',
  };

  try {
    const result = await registration(person);
    flash(req, result.message);
    res.redirect('/confirm');
  } catch (error) {
    res.status(500).json(error.message || error);
  }
});

module.exports = router;
