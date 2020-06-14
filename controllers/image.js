const incrementImageCount = (req, res, db) => {
  const {id} = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    // Returns an object
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => res.status(400).json('Unable to get entries'))
}

module.exports = {
  incrementImageCount: incrementImageCount
}
