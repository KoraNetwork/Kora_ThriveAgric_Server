/* globals User, sails */

module.exports = {

  friendlyName: 'Index',

  inputs: {
    role: {
      type: 'string'
    },
    page: {
      type: 'number'
    },
    perPage: {
      type: 'number'
    },
    sortColumn: {
      type: 'string'
    },
    sortType: {
      type: 'string'
    },
    emailAddress: {
      type: 'string'
    }
  },

  exits: {
    badRequest: {
      statusCode: 400
    }
  },

  fn: async function (inputs, exits) {

    if(!User.roles.includes(inputs.role)) return exits.badRequest({message: 'Invalid role given'});

    let query = { where: {} };

    if(inputs.firstName) query.where.firstName = { contains: inputs.firstName };
    if(inputs.lastName) query.where.lastName = { contains: inputs.lastName };
    if(inputs.emailAddress) query.where.emailAddress = { contains: inputs.emailAddress };
    const sortColumn = inputs.sortColumn ? inputs.sortColumn : 'createdAt';
    const sortType = inputs.sortType ? inputs.sortType : 'desc';

    query.where.role = inputs.role;

    const count = await User.count(query);

    query.select = ['id','firstName','lastName', 'phoneNumber', 'emailAddress','createdAt', 'emailStatus', 'role'];
    query.limit = Number(inputs.perPage) > 0 ? inputs.perPage : 10;
    query.skip = Number(inputs.page) > 0 ? (inputs.page - 1) * inputs.perPage : 0;
    query.sort = `${sortColumn} ${sortType}`;

    const users = await User.find(query);

    return exits.success({users, count});

  }

};
