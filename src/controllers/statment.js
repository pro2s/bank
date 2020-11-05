const session = require('express-session');
const statment = require('../api/accounts/statment');

module.exports = async (req, res) => {
  try {
    const token = req.query.token || req.session.token;
    const data = await statment(token);

    res.render('data', {title: 'Logon', data: JSON.stringify(data, null, 4)});
  } catch(error) {
    return res.status(500).json(error.message || error);
  }
}
