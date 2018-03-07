module.exports = {


  friendlyName: 'Update password',


  description: 'Update the password for the logged-in user.',


  inputs: {

    currentPassword: {
      description: 'Unencrypted current password.',
      example: 'abc123v2',
      required: true
    },

    newPassword: {
      description: 'The new, unencrypted password.',
      example: 'abc123v2',
      required: true
    }

  },

  exits: {

    badCombo: {
      statusCode: 400
    },

    success: {
      statusCode: 202
    }
  },

  fn: async function (inputs, exits) {
    const currentUser = this.req.currentUser;

    await sails.helpers.passwords.checkPassword(inputs.currentPassword, currentUser.password)
      .intercept('incorrect', e => {
        exits.badCombo({error: 'Wrong current password'})
      });

    const hashed = await sails.helpers.passwords.hashPassword(inputs.newPassword);

    await User.update({ id: currentUser.id }).set({ password: hashed });

    return exits.success();
  }

};
