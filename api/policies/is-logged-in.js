
module.exports = async function (req, res, proceed) {

  if(req.currentUser && req.currentUser.id) return proceed();

  return res.unauthorized();
};
