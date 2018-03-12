module.exports = {


  friendlyName: 'Update profile',


  description: 'Update the profile for the logged-in user.',


  inputs: {

    firstName: {
      type: 'string'
    },

    lastName: {
      type: 'string'
    },

    emailAddress: {
      type: 'string'
    },

  },


  exits: {

    emailAlreadyInUse: {
      statusCode: 409,
      description: 'The provided email address is already in use.',
    },

    badRequest: {
      statusCode: 400
    }
  },


  fn: async function (inputs, exits) {

    const currentUser = this.req.currentUser;

    var newEmailAddress = inputs.emailAddress;
    if (newEmailAddress !== undefined) {
      newEmailAddress = newEmailAddress.toLowerCase();
    }

    // Determine if this request wants to change the current user's email address,
    // revert her pending email address change, modify her pending email address
    // change, or if the email address won't be affected at all.
    var desiredEffectReEmail;// ('changeImmediately', 'beginChange', 'cancelPendingChange', 'modifyPendingChange', or '')
    if (
      newEmailAddress === undefined ||
      (currentUser.emailStatus !== 'changeRequested' && newEmailAddress === currentUser.emailAddress) ||
      (currentUser.emailStatus === 'changeRequested' && newEmailAddress === currentUser.emailChangeCandidate)
    ) {
      desiredEffectReEmail = '';
    } else if (currentUser.emailStatus === 'changeRequested' && newEmailAddress === currentUser.emailAddress) {
      desiredEffectReEmail = 'cancelPendingChange';
    } else if (currentUser.emailStatus === 'changeRequested' && newEmailAddress !== currentUser.emailAddress) {
      desiredEffectReEmail = 'modifyPendingChange';
    } else if (!sails.config.custom.verifyEmailAddresses || currentUser.emailStatus === 'unconfirmed') {
      desiredEffectReEmail = 'changeImmediately';
    } else {
      desiredEffectReEmail = 'beginChange';
    }


    // If the email address is changing, make sure it is not already being used.
    if (_.contains(['beginChange', 'changeImmediately', 'modifyPendingChange'], desiredEffectReEmail)) {
      let conflictingUser = await User.findOne({
        or: [
          { emailAddress: newEmailAddress },
          { emailChangeCandidate: newEmailAddress }
        ]
      });
      if (conflictingUser) {
        throw 'emailAlreadyInUse';
      }
    }

    var valuesToSet = {
      firstName: inputs.firstName,
      lastName: inputs.lastName,
    };

    switch (desiredEffectReEmail) {

      // Change now
      case 'changeImmediately':
        Object.assign(valuesToSet, {
          emailAddress: newEmailAddress,
          emailChangeCandidate: '',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailStatus: currentUser.emailStatus === 'unconfirmed' ? 'unconfirmed' : 'confirmed'
        });
        break;

      // Begin new email change, or modify a pending email change
      case 'beginChange':
      case 'modifyPendingChange':
        Object.assign(valuesToSet, {
          emailChangeCandidate: newEmailAddress,
          emailProofToken: await sails.helpers.strings.random('url-friendly'),
          emailProofTokenExpiresAt: Date.now() + sails.config.custom.emailProofTokenTTL,
          emailStatus: 'changeRequested'
        });
        break;

      // Cancel pending email change
      case 'cancelPendingChange':
        Object.assign(valuesToSet, {
          emailChangeCandidate: '',
          emailProofToken: '',
          emailProofTokenExpiresAt: 0,
          emailStatus: 'confirmed'
        });
        break;

      // Otherwise, do nothing re: email
    }

    let upstream = this.req.file('avatar');
    if (upstream._files.length > 0) {
      let files = await sails.helpers.uploadFiles.with({
        upstream: upstream,
        dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/users/avatars/' + currentUser.id)
      });

      const filename = files[0].fd.match(/.+\/(.+\..+)$/)[1];
      valuesToSet.avatarUrl = require('util').format('%s/uploads/users/avatars/%s/%s', sails.config.custom.baseUrl, currentUser.id, filename);
      valuesToSet.avatarFd =  files[0].fd;
    } else {
      upstream.noMoreFiles()
    }

    // Save to the db
    await User.update({id: currentUser.id }).set(valuesToSet);

    // If this is an immediate change, and billing features are enabled,
    // then also update the billing email for this user's linked customer entry
    // in the Stripe API to make sure they receive email receipts.
    // > Note: If there was not already a Stripe customer entry for this user,
    // > then one will be set up implicitly, so we'll need to persist it to our
    // > database.  (This could happen if Stripe credentials were not configured
    // > at the time this user was originally created.)
    if(desiredEffectReEmail === 'changeImmediately' && sails.config.custom.enableBillingFeatures) {
      let didNotAlreadyHaveCustomerId = (! currentUser.stripeCustomerId);
      let stripeCustomerId = await sails.helpers.stripe.saveBillingInfo.with({
        stripeCustomerId: currentUser.stripeCustomerId,
        emailAddress: newEmailAddress
      });
      if (didNotAlreadyHaveCustomerId){
        await User.update({ id: currentUser.id }).set({
          stripeCustomerId
        });
      }
    }

    // If an email address change was requested, and re-confirmation is required,
    // send the "confirm account" email.
    if (desiredEffectReEmail === 'beginChange' || desiredEffectReEmail === 'modifyPendingChange') {
      await sails.helpers.sendTemplateEmail.with({
        to: newEmailAddress,
        subject: 'Your account has been updated',
        template: 'email-verify-new-email',
        templateData: {
          firstName: inputs.firstName||currentUser.firstName,
          token: valuesToSet.emailProofToken
        }
      });
    }

    delete valuesToSet.emailProofToken;
    delete valuesToSet.avatarFd;
    return exits.success(valuesToSet);

  }


};
