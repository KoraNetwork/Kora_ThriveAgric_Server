module.exports = {


  friendlyName: 'Update',

  inputs: {

    id: {
      type: 'string'
    },

    bankName: {
      type: 'string'
    },

    bankRoutingNumber: {
      type: 'string'
    },

    acountNumber: {
      type: 'string'
    },

  },


  exits: {
    badRequest: {
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {

    let valuesToSet = {};
    if(inputs.bankName) valuesToSet.address = inputs.bankName;
    if(inputs.bankRoutingNumber) valuesToSet.address = inputs.bankRoutingNumber;
    if(inputs.acountNumber) valuesToSet.address = inputs.acountNumber;
    sails.log('zzzzzzz');
    sails.log(valuesToSet);
    sails.log('zzzzzzz');
    Bank.update({id: inputs.id }).set(valuesToSet).exec(function(error, result) {
      if (error) return exits.badRequest({
        error
      });
      return exits.success(valuesToSet)
    })

  }
};
