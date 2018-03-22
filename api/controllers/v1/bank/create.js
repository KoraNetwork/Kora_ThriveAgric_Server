module.exports = {

  friendlyName: 'Create',

  inputs: {

    bankName: {
      type: 'string'
    },

    bankRoutingNumber: {
      type: 'string'
    },

    acountNumber: {
      type: 'string'
    }

  },

  exits: {
    badRequest: {
      statusCode: 400
    }
  },

  fn: async function (inputs, exits) {

    const user = await Bank.create({
      bankName: inputs.bankName,
      bankRoutingNumber: inputs.bankRoutingNumber,
      acountNumber: inputs.acountNumber,
    })
      .intercept('*', (e) => {
        return exits.badRequest(e)
        // return exits.conflict({
        //   error: 'Email address is already in use.'
        // })
      }).fetch()

    return exits.success({
      message: 'Successfully saved.'
    });

  }

};
