const JWT = require('jsonwebtoken');

module.exports = {

  inputs: {
    token: {
      type: 'string',
      default: ''
    }
  },

  exits: {
    JsonWebTokenError: {
      description: 'Invalid token'
    },
    TokenExpiredError: {
      statusCode: 401
    }
  },

  fn: async function (inputs, exits) {
    let payload = {};

    JWT.verify(inputs.token, sails.config.session.secret, (err, decoded) => {
      if (err) {
        exits[err.name]();
      }
      payload = decoded;
    });

    exits.success(payload)
  }
};
