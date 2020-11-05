const express = require('express');
const router = express.Router();
const statment = require('../api/individual/accounts/statment');

router.get('/statment', async (req, res) => {
  try {
    const token = req.query.token || req.session.token;
    const data = await statment(token);

    res.render('data', {title: 'Logon', data: JSON.stringify(data, null, 2)});
  } catch(error) {
    return res.status(500).json(error.message || error);
  }
})

module.exports = router;
