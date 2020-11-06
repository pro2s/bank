const express = require('express');
const router = express.Router();
const statment = require('../api/partner/accounts/statment');
const accounts = require('../api/partner/accounts');

router.get('/statment', async (req, res) => {
  try {
    const token = req.query.token || req.session.token;

    const accountsList = await accounts(token);
    const numbers = accountsList.accounts.map(a => a.number).join(',');
    const data = await statment(token, {number: numbers});

    res.render('data', {title: 'Logon', data: {accountsList, data}});
  } catch(error) {
    return res.status(500).json(error.message || error);
  }
});

module.exports = router;
