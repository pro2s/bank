const express = require('express');
const router = express.Router();
const registration = require('../api/registration');

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
    req.session.flash.push(result);
    req.session.save();
    res.redirect('/confirm');
  } catch (error) {
    res.status(500).json(error.message || error);
  }
});

module.exports = router;