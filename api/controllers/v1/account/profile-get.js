module.exports = {


  friendlyName: 'Get profile',


  description: '',


  inputs: {
    userId: {
      type: 'number'
    }
  },


  exits: {

    notFound: {
      statusCode: 404,
      description: 'No users with such id found'
    }
  },

  fn: async function (inputs, exits) {

    const user = this.req.currentUser;

    if (!user) {
      return exits.notFound()
    }

    return exits.success(User.asJSON(user));
  }


};
