const get = require('../../get');

module.exports = (token, params = {}) => get(token, '/partner/1.0.2/accounts/statement', params);