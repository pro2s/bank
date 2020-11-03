const statment = require('../api/accounts/statment');

module.exports = async (req, res) => {
  try {
    const data = await statment(req.query.token);

    return res.status(200).json(data);
  } catch(error) {
    return res.status(500).json(error.message || error);
  }
}
