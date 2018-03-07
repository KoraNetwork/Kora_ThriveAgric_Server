module.exports = {

  friendlyName: 'Get current user',

  inputs: {
    token: {
      type: 'string'
    }
  },

  exits: {

    success: {
      outputFriendlyName: 'Current user',
      outputType: 'ref'
    },

  },

  fn: async function (inputs, exits) {
    let payload, currentUser;

    try {
      payload = await sails.helpers.jwtVerify.with({token:inputs.token});
      currentUser = await User.findOne(payload.uid);
    } catch(e) {}

    return exits.success(currentUser);
  }

};
