const registration = require('../api/registration');
const personId = 'Undefined';

module.exports = async (req, res) => {
  const person= {
    personId: req.query.id || null,
    isResident: req.query.resident || null,
  };

  try {
    const result = await registration(person);
    result.deviceId = process.env.KSUID;

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error.message || error);
  }
};
