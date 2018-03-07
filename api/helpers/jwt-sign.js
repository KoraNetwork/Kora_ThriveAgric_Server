const JWT = require('jsonwebtoken');

module.exports = {

  inputs: {
    payload: {
      type: 'ref'
    },
    role: {
      type: 'string'
    }
  },

  exits: {},

  fn: async function (inputs, exits) {
    let token = JWT.sign({
      ...inputs.payload, role: inputs.role || 'user'
    }, sails.config.session.secret, { expiresIn: '1d' });

    exits.success(token)
  }
};
