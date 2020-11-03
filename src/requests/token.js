const token = require('../api/token');
const querystring = require('querystring');

module.exports = async (req, res) => {
  const credentials = {
    login: req.query.login,
    password: req.query.password,
  };

  try {
    const result = await token(credentials);
    res.status(200).send(querystring.escape(result.access_token));
  } catch (error) {
    res.status(500).json(error.message || error);
  }
}
