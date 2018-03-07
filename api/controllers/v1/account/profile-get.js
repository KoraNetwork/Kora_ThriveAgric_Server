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

    const response = {
      id: user.id,
      emailAddress: user.emailAddress,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl
    };

    return exits.success(response);
  }


};
