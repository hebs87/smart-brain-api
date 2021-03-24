const jwt = require('jsonwebtoken');
const redis = require('redis');
// Setup redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignIn = (db, bcrypt, req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return Promise.reject('Incorrect form submission');
  }
  // Get the email and hash from login and compare the hash with the user's input
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if (isValid) {
        // Get the user record from the user's table that matches the email entered
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('Unable to get user'));
      } else {
        Promise.reject('Wrong credentials');
      }
    })
    .catch(err => Promise.reject('Wrong credentials'))
}

const getAuthTokenId = () => {
  console.log('auth ok')
}

const signToken = (email) => {
  // Set user's email as the jwtPayload and sign the token
  const jwtPayload = {email};
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, {expiresIn: '2 days'});
}

const createSessions = (user) => {
  const {id, email} = user;
  // Create a token
  const token = signToken(email);
  return {success: 'true', userId: id, token};
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const {authorization} = req.headers;
  return authorization ? getAuthTokenId() :
    handleSignIn(db, bcrypt, req, res)
      .then(data => {
        return data.id && data.email ? createSessions(data) : Promise.reject(data);
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err));
}

module.exports = {
  signinAuthentication
}
