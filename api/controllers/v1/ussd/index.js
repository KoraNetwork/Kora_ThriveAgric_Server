module.exports = {


  friendlyName: 'USSD',


  description: `Processing USSD requests using Africa's Talking API

    A few things to note about USSD:
      - USSD is session driven. Every request we send you will contain a sessionId, and this will be maintained until that session is completed
      - You will need to let the Mobile Service Provider know whether the session is complete or not. If the session is ongoing,
        please begin your response with CON. If this is the last response for that session, begin your response with END.
      - If we get a HTTP error response (Code 40X) from your script, or a malformed response (does not begin with CON or END,
        we will terminate the USSD session gracefully.
  `,


  inputs: {
    sessionId: {
      description: 'This is a session unique value generated when the session starts and sent every time a mobile subscriber response has been received',
      type: 'string'
    },
    phoneNumber: {
      description: 'This is the mobile subscriber number',
      type: 'string'
    },
    serviceCode: {
      description: 'This is your USSD code. Please note that it doesn\'t show your channel for shared USSD codes.',
      type: 'string'
    },
    text: {
      description: 'This shows the user input. It concatenates all the previous user input within the session with a *',
      type: 'string'
    },
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    sails.log.info(inputs);

    let response;

    switch (inputs.text) {
      case '':
        response = 'CON WELCOME TO KORA\n\n';
        response += '1. LOGIN\n';
        response += '2. RESET PIN\n';
        response += '3. EXIT';
        break;

      case '1':
        response = 'CON Please enter valid pin number';
        break;

      case '2':
        response = 'CON RESET PIN\n\n';
        response += '1. HOW TO RESET?\n';
        response += '2. ENNTER RESET CODE\n';
        response += '3. EXIT';
        break;

      case '3':
      case '2*3':
        response = 'END';
        break;

      case '2*1':
        response = 'CON Please call XXX number to verify your identity and receive one-time sms reset code';
        break;

      case '2*2':
        response = 'CON Please enter one-time reset code';
        break;

      default:
        response = inputs.text;
    }

    this.res.set('Content-Type', 'text/plain');

    return exits.success(response);

  }


};
