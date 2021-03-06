
module.exports = {

  attributes: {

    bankName: {
      type: 'string',
      maxLength: 32,
    },

    bankRoutingNumber: {
      type: 'string'
    },

    acountNumber: {
      type: 'string'
    },

    agent: {
      model: 'user'
    }

  },

  asJSON: function (bank) {
    return _.pick(bank, ['id', 'bankName', 'bankRoutingNumber', 'acountNumber']);
  },

};
