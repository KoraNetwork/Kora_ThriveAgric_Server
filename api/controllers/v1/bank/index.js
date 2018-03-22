/* globals User, sails */

module.exports = {

  friendlyName: 'Index',

  inputs: {

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
    filterParams: {
      type: 'string'
    }
  },

  exits: {
    badRequest: {
      statusCode: 400
    }
  },

  fn: async function (inputs, exits) {

    let query = { where: { and: [] } };

    if(inputs.emailAddress) query.where.or = [];
    const sortColumn = inputs.sortColumn ? inputs.sortColumn : 'createdAt';
    const sortType = inputs.sortType ? inputs.sortType : 'desc';

    query.where.and.push({role: inputs.role})

    const count = await Bank.count(query);

    query.select = ['id','bankName','bankRoutingNumber', 'acountNumber'];
    query.limit = Number(inputs.perPage) > 0 ? inputs.perPage : 10;
    query.skip = Number(inputs.page) > 0 ? (inputs.page - 1) * inputs.perPage : 0;
    query.sort = `${sortColumn} ${sortType}`;

    const banks = await Bank.find(query);

    return exits.success({banks, count});

  }

};
