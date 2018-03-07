const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sails.config.sendgridApiKey);

module.exports = {

  inputs: {
    to: {
      type: 'string',
      required: true
    },

    subject: {
      type: 'string'
    },

    html: {
      type: 'string'
    }
  },

  exits: {},

  fn: async function (inputs, exits) {

    const msg = {
      to: inputs.to,
      from: 'no-reply@kora-thrive-agric.com',
      subject: inputs.subject || 'Sample subject',
      html: inputs.html || '<h1>sample html</h1>'
    };

    sgMail.send(msg);

    exits.success()
  }
};
