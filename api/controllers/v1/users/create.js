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

    address: {
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

    businessName: {
      type: 'string'
    },

    businessAddress: {
      type: 'string'
    },

    question1: {
      type: 'string'
    },

    question2: {
      type: 'string'
    },

    answer1: {
      type: 'string'
    },

    answer2: {
      type: 'string'
    },

    userType: {
      type: 'string'
    },

    payrollStatus: {
      type: 'boolean'
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

    const user = await User.create({
      emailAddress: inputs.emailAddress,
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      emailStatus: inputs.emailStatus,
      phoneNumber: inputs.phoneNumber,
      address: inputs.address,
      businessName: inputs.businessName,
      businessAddress: inputs.businessAddress,
      question1: inputs.question1,
      question2: inputs.question2,
      answer1: inputs.answer1,
      answer2: inputs.answer2,
      userType: inputs.userType,
      password: await sails.helpers.passwords.hashPassword(inputs.firstName + '-123'),
      role: inputs.role,
    }).intercept('*', (e) => {
        return exits.badRequest({e})
      }).fetch()

    if (user && user.role == 'agent') {
      const bank = await Bank.create({
        agent: user.id,
        bankName: inputs.bankName,
        bankRoutingNumber: inputs.bankRoutingNumber,
        acountNumber: inputs.acountNumber,
      }).intercept('*', (e) => {
          User.destroy({id: user.id});
          return exits.badRequest({e})
      }).fetch()

      await User.update({id: bank.agent}).set({bank: bank.id})

    }

    return exits.success({
      message: 'Successfully saved.'
    });

  }

};
