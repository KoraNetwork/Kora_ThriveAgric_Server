/**
 * custom hook
 *
 * @description :: A hook definition.  Extends Sails by adding shadow routes, implicit actions, and/or initialization logic.
 * @docs        :: https://sailsjs.com/docs/concepts/extending-sails/hooks
 */

module.exports = function defineCustomHook(sails) {

  return {

    /**
     * Runs when a Sails app loads/lifts.
     *
     * @param {Function} done
     */
    initialize: async function (done) {

      sails.log.info('Initializing hook... (`api/hooks/custom`)');

      // Check Stripe configuration (for billing).
      var IMPORTANT_STRIPE_CONFIG = ['stripeSecret', 'stripePublishableKey'];
      var isMissingStripeConfig = _.difference(IMPORTANT_STRIPE_CONFIG, Object.keys(sails.config.custom)).length > 0;

      if (isMissingStripeConfig) {

        let missingFeatureText = isMissingStripeConfig ? 'billing and email' : isMissingStripeConfig ? 'billing' : 'email';
        let suffix = '';
        if (_.contains(['silly'], sails.config.log.level)) {
          suffix =
`
> Tip: To exclude sensitive credentials from source control, use:
> • config/local.js (for local development)
> • environment variables (for production)
>
> If you want to check them in to source control, use:
> • config/custom.js  (for development)
> • config/env/staging.js  (for staging)
> • config/env/production.js  (for production)
>
> (See https://sailsjs.com/docs/concepts/configuration for help configuring Sails.)
`;
        }

        let problems = [];
        if (sails.config.custom.stripeSecret === undefined) {
          problems.push('No `sails.config.custom.stripeSecret` was configured.');
        }
        if (sails.config.custom.stripePublishableKey === undefined) {
          problems.push('No `sails.config.custom.stripePublishableKey` was configured.');
        }

        sails.log.verbose(
`Some optional settings have not been configured yet:
---------------------------------------------------------------------
${problems.join('\n')}

Until this is addressed, this app's ${missingFeatureText} features
will be disabled and/or hidden in the UI.

 [?] If you're unsure or need advice, come by https://sailsjs.com/support
---------------------------------------------------------------------${suffix}`);
      }//ﬁ

      // Set an additional config keys based on whether Stripe config is available.
      // This will determine whether or not to enable various billing features.
      sails.config.custom.enableBillingFeatures = !isMissingStripeConfig;

      // After "sails-hook-organics" finishes initializing, configure Stripe
      // with any available credentials.
      sails.after('hook:organics:loaded', ()=>{

        sails.helpers.stripe.configure({
          secret: sails.config.custom.stripeSecret
        });

      });//_∏_

      // ... Any other app-specific setup code that needs to run on lift,
      // even in production, goes here ...

      return done();

    },


    routes: {

      /**
       * Runs before every matching route.
       *
       * @param {Ref} req
       * @param {Ref} res
       * @param {Function} next
       */
      before: {
        '/*': {
          skipAssets: true,
          fn: async function(req, res, next){
            let loggedInUser = await sails.helpers.getCurrentUser(req.headers['session-token']);
            if (!loggedInUser) return next();

            req.currentUser = loggedInUser;

            const MS_TO_BUFFER = 60*1000;
            const now = Date.now();
            if (loggedInUser && loggedInUser.lastSeenAt < now - MS_TO_BUFFER) {
              User.update({id: loggedInUser.id})
              .set({ lastSeenAt: now })
              .exec((err)=>{
                if (err) {
                  sails.log.error('Background task failed: Could not update user (`'+loggedInUser.id+'`) with a new `lastSeenAt` timestamp.  Error details: '+err.stack);
                  return;
                }
                sails.log.verbose('Updated the `lastSeenAt` timestamp for user `'+loggedInUser.id+'`.');
              });
            }

            return next();
          }
        }
      }
    }


  };

};
