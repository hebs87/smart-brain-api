const redisClient = require('./signin').redisClient;

const requireAuth = (req, res, next) => {
  // Middleware to check if user is authorised before proceeding with relevant request
  const {authorization} = req.headers;

  if (!authorization) return res.status(401).json('Unauthorized');

  const token = authorization.replace('Bearer ', '');
  return redisClient.get(token, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    // Proceed with the request
    return next();
  });
}

module.exports = {
  requireAuth
}
