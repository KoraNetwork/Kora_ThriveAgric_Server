module.exports.security = {

  cors: {
    allRoutes: true,
    allowOrigins: '*',
    allowRequestHeaders: [
      'content-type',
      'session-token'
    ],
    allowCredentials: false,
  },

  csrf: false

};
