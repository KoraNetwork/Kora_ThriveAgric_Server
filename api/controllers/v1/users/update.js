module.exports = {


  friendlyName: 'Update',

  inputs: {

    id: {
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

    phoneNumber: {
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
    }
  },


  fn: async function (inputs, exits) {

    let valuesToSet = {};
    if(inputs.emailAddress) valuesToSet.emailAddress = inputs.emailAddress;
    if(inputs.firstName) valuesToSet.firstName = inputs.firstName;
    if(inputs.lastName) valuesToSet.lastName = inputs.lastName;
    if(inputs.emailStatus) valuesToSet.emailStatus = inputs.emailStatus;
    if(inputs.phoneNumber) valuesToSet.phoneNumber = inputs.phoneNumber;
    if(inputs.address) valuesToSet.address = inputs.address;
    if(inputs.businessName) valuesToSet.address = inputs.businessName;
    if(inputs.businessAddress) valuesToSet.address = inputs.businessAddress;
    if(inputs.question1) valuesToSet.question1 = inputs.question1;
    if(inputs.question2) valuesToSet.question2 = inputs.question2;
    if(inputs.answer1) valuesToSet.answer1 = inputs.answer1;
    if(inputs.answer2) valuesToSet.answer2 = inputs.answer2;
    if(inputs.userType) valuesToSet.userType = inputs.userType;
    sails.log('zzzzzzz');
    sails.log(valuesToSet);
    sails.log('zzzzzzz');
    User.update({id: inputs.id }, valuesToSet).fetch().exec(function (error, result) {
      if (error) return exits.badRequest({
        error
      });
      if (result[0] && result[0].role == 'agent') {
        let valuesToSetBank = {};
        if(inputs.bankName) valuesToSetBank.bankName = inputs.bankName;
        if(inputs.bankRoutingNumber) valuesToSetBank.bankRoutingNumber = inputs.bankRoutingNumber;
        if(inputs.acountNumber) valuesToSetBank.acountNumber = inputs.acountNumber;
        Bank.update({id: result[0].bank},valuesToSetBank ).exec(function (error, result){});
      }
      return exits.success(valuesToSet)
    });

  }


};
