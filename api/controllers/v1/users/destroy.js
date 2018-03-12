/* globals User */

module.exports = {

  friendlyName: 'Destroy',


  inputs: {
    id: {
      type: 'string'
    }
  },

  exits: {
    notFound: {
      statusCode: 404,
      description: 'No user found'
    },
    badRequest: {
      statusCode: 400
    },
    noContent: {
      statusCode: 204
    }
  },

  fn: async function (inputs, exits) {

    const currUser = this.req.currentUser;

    const user = await User.findOne(inputs.id);

    if(!user) return exits.notFound();

    if (currUser.id === user.id) {
      return exits.badRequest({
        error: 'You can not delete yourself'
      })
    }

    await User.destroy({id: user.id});

    return exits.noContent();

  }

};
