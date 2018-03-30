/* global User */

module.exports = {


  friendlyName: 'Show',

  inputs: {
    id: {
      type: 'string',
      required: true
    }
  },


  exits: {
    notFound: {
      statusCode: 404
    }
  },


  fn: async function (inputs, exits) {

    const banks = await Bank.find({id: inputs.id}).populate('agent').limit(1);

    if (banks.length === 0) {
      return exits.notFound()
    }

    return exits.success(Bank.asJSON(banks[0]));

  }


};
