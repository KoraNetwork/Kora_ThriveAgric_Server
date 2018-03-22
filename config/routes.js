
module.exports.routes = {
  'DELETE /api/v1/account/logout':                        { action: 'v1/account/logout' },
  'GET    /api/v1/account/profile':                       { action: 'v1/account/profile-get' },
  'PUT    /api/v1/account/update-profile':                { action: 'v1/account/profile-update' },
//'PUT    /api/v1/account/update-billing-card':           { action: 'account/update-billing-card' },

  'POST   /api/v1/entrance/login':                        { action: 'v1/entrance/login' },
  'POST   /api/v1/entrance/signup':                       { action: 'v1/entrance/signup' },
  'POST   /api/v1/entrance/confirmEmail':                 { action: 'v1/entrance/confirm-email' },

  'PUT    /api/v1/passwords/update':                      { action: 'v1/passwords/update' },
  'POST   /api/v1/passwords/forgot':                      { action: 'v1/passwords/forgot' },
  'PUT    /api/v1/passwords/restore':                     { action: 'v1/passwords/restore' },

  'GET    /api/v1/users':                                 { action: 'v1/users/index' },
  'POST   /api/v1/users':                                 { action: 'v1/users/create' },
  'PUT    /api/v1/users/:id':                             { action: 'v1/users/update' },
  'GET    /api/v1/users/:id':                             { action: 'v1/users/show' },
  'DELETE /api/v1/users/:id':                             { action: 'v1/users/destroy' },

  'GET    /api/v1/banks':                                 { action: 'v1/bank/index' },
  'POST   /api/v1/banks':                                 { action: 'v1/bank/create'},
  'PUT    /api/v1/banks/:id':                             { action: 'v1/bank/update' },
  'GET    /api/v1/banks/:id':                             { action: 'v1/bank/show' },

};
