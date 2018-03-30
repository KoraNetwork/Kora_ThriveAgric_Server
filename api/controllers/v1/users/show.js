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

    const users = await User.find({id: inputs.id}).populate('bank').limit(1);

    if (users.length === 0) {
      return exits.notFound()
    }

    return exits.success(User.asJSON(users[0]));

  }


};
