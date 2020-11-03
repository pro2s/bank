const confirm = require('../api/confirm');

module.exports = async (req, res) => {
  try {
    const result = await confirm(req.query.sms || '');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error.message || error);
  }
};
