const handleSignIn = (db, bcrypt) => (req, res) => {
  const {email, password} = req.body;
  // Get the email and hash from login and compare the hash with the user's input
  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash)
      if (isValid) {
        // Get the user record from the user's table that matches the email entered
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json('Unable to get user'));
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch(err => res.status(400).json('Wrong credentials'))
}

module.exports = {
  handleSignIn: handleSignIn
}
