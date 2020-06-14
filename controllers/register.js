const handleRegister = (req, res, db, bcrypt) => {
  const {name, email, password} = req.body;
  if (!name || !email || !password) {
    return res.status(400).json('Incorrect form submission');
  }
  // Hash the password
  const hash = bcrypt.hashSync(password);
  // Create a transaction to update multiple tables - if one fails, all faile
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      // Returns email as an object in an array
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          // Return all records
          .returning('*')
          // Create a new record
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date()
          })
          // Return the first record in the array
          .then(user => res.json(user[0]))
      })
      // Commit the changes if they all pass
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json('Something went wrong, please try again!'))
}

module.exports = {
  handleRegister: handleRegister
}
