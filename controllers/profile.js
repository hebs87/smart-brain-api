const handleGetProfile = (req, res, db) => {
  const {id} = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      user.length ? res.json(user[0]) : res.status(400).json('User profile not found')
    })
    .catch(err => res.status(400).json('Error getting user profile'));
}

const handleUpdateProfile = (req, res, db) => {
  const {id} = req.params;
  const {name, age, pet} = req.body.formInput;
  db('users')
    .where({id})
    .update({name, age, pet})
    .then(resp => {
      resp ? res.json('success') : res.status(400).json('Unable to update')
    })
    .catch(err => res.status(400).json('Error updating user profile'));
}

module.exports = {
  handleGetProfile,
  handleUpdateProfile
}
