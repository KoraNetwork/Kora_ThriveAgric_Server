/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': 'is-logged-in',

  // Bypass the `is-logged-in` policy for:
  'v1/entrance/*': true,
  'v1/passwords/restore': true,
  'v1/passwords/forgot': true,
  // 'account/logout': true,
  'v1/ussd/index': true,

};
