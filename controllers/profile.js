const handleGetProfile = (req, res, db) => {
  const {id} = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      user.length ? res.json(user[0]) : res.status(400).json('User profile not found')
    })
    .catch(err => res.status(400).json('Error getting user profile'));
}

module.exports = {
  handleGetProfile: handleGetProfile
}
