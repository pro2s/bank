
const post = require('./post');

module.exports = async person => {
  if (process.env.DEBUG) {
    person = {personId: 'TEST', isResident: true};
  }

  const data = JSON.stringify({
    ...person,
    deviceId: process.env.KSUID,
  });

  const result = await post(
    '/individual/1.0.0/registration/registration',
    'application/json',
    data,
  );

  return JSON.parse(result);
};
