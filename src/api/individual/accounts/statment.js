const get = require('../../get');

module.exports = (token, params = {}) => get(token, '/individual/1.0.0/accounts/statement', params);