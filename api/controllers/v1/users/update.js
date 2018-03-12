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

    phoneNumber: {
      type: 'string'
    },

    password: {
      type: 'string'
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let valuesToSet = {};
    if(inputs.emailAddress) valuesToSet.emailAddress = inputs.emailAddress;
    if(inputs.firstName) valuesToSet.firstName = inputs.firstName;
    if(inputs.lastName) valuesToSet.lastName = inputs.lastName;
    if(inputs.emailStatus) valuesToSet.emailStatus = inputs.emailStatus;
    if(inputs.phoneNumber) valuesToSet.phoneNumber = inputs.phoneNumber;
    sails.log('zzzzzzz');
    sails.log(valuesToSet);
    sails.log('zzzzzzz');
    let res = await User.update({id: inputs.id }).set(valuesToSet);
    sails.log('zzzzzzz');
    sails.log(valuesToSet);
    sails.log('zzzzzzz');

    return exits.success(valuesToSet);

  }


};
