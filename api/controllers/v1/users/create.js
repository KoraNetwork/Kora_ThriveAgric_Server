/* globals User, sails */

module.exports = {

  friendlyName: 'Create',

  inputs: {

    role: {
      type: 'string'
    },

    emailAddress: {
      type: 'string',
      isEmail: true
    },

    firstName:  {
      required: true,
      type: 'string'
    },

    lastName:  {
      required: true,
      type: 'string'
    },

    emailStatus: {
      type: 'string'
    },

    phoneNumber: {
      type: 'string'
    },

    password: {
      type: 'string'
    }
  },

  exits: {
    badRequest: {
      statusCode: 400
    },
    conflict: {
      statusCode: 409
    }
  },

  fn: async function (inputs, exits) {

    if(!User.roles.includes(inputs.role)) return exits.badRequest({message: 'Invalid role given'});

    await User.create({
      emailAddress: inputs.emailAddress,
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      emailStatus: inputs.emailStatus,
      phoneNumber: inputs.phoneNumber,
      password: await sails.helpers.passwords.hashPassword(inputs.firstName + '-123'),
      role: inputs.role
    })
      .intercept('E_UNIQUE', () => {
        return exits.conflict({
          error: 'Email address is already in use.'
        })
      });

    return exits.success({
      message: 'Successfully saved.'
    });

  }

};
