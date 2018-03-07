module.exports = {

  friendlyName: 'Upload file',

  inputs: {
    upstream: {
      type: 'ref',
      required: true
    },
    dirname: {
      type: 'string',
      required: true
    }
  },

  exits: {
    error: {
      statusCode: 499
    }
  },

  fn: async function (inputs, exits) {

    const uploadPromise = new Promise((resolve, reject) => {
      inputs.upstream.upload({
        dirname: inputs.dirname
      }, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      })
    });

    uploadPromise.then(files => {
      if(files.length === 0) return exits.error();

      return exits.success(files)
    });
  }


};

