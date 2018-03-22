  /**
 * User.js
 *
 * A user who can log in to this application.
 */

const phoneRegex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d| 2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]| 4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;

const availableRoles = ['admin', 'agent', 'farmer', 'user'];

const availableQuestion = [
  'What was your childhood nickname',
  'What is the first name of your best friend',
  'What is your mother’s maiden name?',
  'What is the name of your favorite sports team?',
  'Who is your favorite singer?',
  'What is your passport number?'
];

module.exports = {

  attributes: {

    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'carol.reyna@example.com'
    },

    password: {
      type: 'string',
      required: true,
      description: 'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },

    firstName: {
      type: 'string',
      required: true,
      maxLength: 120,
      example: 'Lisa'
    },

    lastName: {
      type: 'string',
      required: true,
      maxLength: 120,
      example: 'Simpson'
    },

    address: {
      type: 'string',
      maxLength: 32,
    },

    bankName: {
      type: 'string',
      maxLength: 32,
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

    passwordResetToken: {
      type: 'string',
      description: 'A unique token used to verify the user\'s identity when recovering a password.  Expires after 1 use, or after a set amount of time has elapsed.'
    },

    passwordResetTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `passwordResetToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },

    stripeCustomerId: {
      type: 'string',
      protect: true,
      description: 'The id of the customer entry in Stripe associated with this user (or empty string if this user is not linked to a Stripe customer -- e.g. if billing features are not enabled).',
      extendedDescription:
        `Just because this value is set doesn't necessarily mean that this user has a billing card.
        It just means they have a customer entry in Stripe, which might or might not have a billing card.`
    },

    hasBillingCard: {
      type: 'boolean',
      description: 'Whether this user has a default billing card hooked up as their payment method.',
      extendedDescription:
        `More specifically, this indcates whether this user record's linked customer entry in Stripe has
        a default payment source (i.e. credit card).  Note that a user have a \`stripeCustomerId\`
        without necessarily having a billing card.`
    },

    billingCardBrand: {
      type: 'string',
      example: 'Visa',
      description: 'The brand of this user\'s default billing card (or empty string if no billing card is set up).',
      extendedDescription: 'To ensure PCI compliance, this data comes from Stripe, where it reflects the user\'s default payment source.'
    },

    billingCardLast4: {
      type: 'string',
      example: '4242',
      description: 'The last four digits of the card number for this user\'s default billing card (or empty string if no billing card is set up).',
      extendedDescription: 'To ensure PCI compliance, this data comes from Stripe, where it reflects the user\'s default payment source.'
    },

    billingCardExpMonth: {
      type: 'string',
      example: '08',
      description: 'The two-digit expiration month from this user\'s default billing card, formatted as MM (or empty string if no billing card is set up).',
      extendedDescription: 'To ensure PCI compliance, this data comes from Stripe, where it reflects the user\'s default payment source.'
    },

    billingCardExpYear: {
      type: 'string',
      example: '2023',
      description: 'The four-digit expiration year from this user\'s default billing card, formatted as YYYY (or empty string if no credit card is set up).',
      extendedDescription: 'To ensure PCI compliance, this data comes from Stripe, where it reflects the user\'s default payment source.'
    },

    emailProofToken: {
      type: 'string',
      description: 'A pseudorandom, probabilistically-unique token for use in our account verification emails.'
    },

    emailProofTokenExpiresAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment when this user\'s `emailProofToken` will expire (or 0 if the user currently has no such token).',
      example: 1502844074211
    },

    emailStatus: {
      type: 'string',
      isIn: ['unconfirmed', 'changeRequested', 'confirmed'],
      defaultsTo: 'confirmed',
      description: 'The confirmation status of the user\'s email address.',
      extendedDescription:
        `Users might be created as "unconfirmed" (e.g. normal signup) or as "confirmed" (e.g. hard-coded
        admin users).  When the email verification feature is enabled, new users created via the
        signup form have \`emailStatus: 'unconfirmed'\` until they click the link in the confirmation email.
        Similarly, when an existing user changes their email address, they switch to the "changeRequested"
        email status until they click the link in the confirmation email.`
    },

    emailChangeCandidate: {
      type: 'string',
      description: 'The (still-unconfirmed) email address that this user wants to change to.'
    },

    phoneNumber: {
      type: 'string',
      regex: phoneRegex,
    },

    tosAcceptedByIp: {
      type: 'string',
      description: 'The IP (ipv4) address of the request that accepted the terms of service.',
      extendedDescription: 'Useful for certain types of businesses and regulatory requirements (KYC, etc.)',
      moreInfoUrl: 'https://en.wikipedia.org/wiki/Know_your_customer'
    },

    lastSeenAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211
    },

    role: {
      type: 'string',
      isIn: availableRoles,
      required: true
    },

    avatarUrl: {
      type: 'string'
    },

    avatarFd: {
      type: 'string'
    },

    question1: {
      type: 'string',
      isIn: availableQuestion
    },

    question2: {
      type: 'string',
      isIn: availableQuestion
    },

    answer1: {
      type: 'string',
      maxLength: 32
    },

    answer2: {
      type: 'string',
      maxLength: 32
    }

  },

  roles: availableRoles,

  question1: availableQuestion,

  question2: availableQuestion,

  asJSON: function (user) {
    return _.pick(user, ['id', 'firstName', 'lastName', 'emailAddress', 'role', 'phoneNumber', 'address',
                        'businessName', 'businessAddress', 'bankName', 'bankRoutingNumber', 'acountNumber',
                         'question1', 'question2', 'answer1', 'answer2'])
  },

  beforeUpdate: function (valuesToUpdate, cb) {
    if (!valuesToUpdate.phoneNumber){
      return cb();
    }
    User.find({phoneNumber: valuesToUpdate.phoneNumber}).exec(function(err, users){
      if(users.length && users[0].id == valuesToUpdate) {
        return cb(new Error('phoneNumber'))
      }else{
        return cb()
      }
    })
  },

  beforeCreate: function (valuesToUpdate, cb) {
    if (!valuesToUpdate.phoneNumber){
      return cb();
    }
    User.find({phoneNumber: valuesToUpdate.phoneNumber}).exec(function(err, users){
      if(users.length) {
        return cb(new Error('phoneNumber'))
      }else{
        return cb()
      }
    })
  },

};
