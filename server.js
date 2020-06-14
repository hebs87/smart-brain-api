const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

dotenv.config();

// DB config
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
});

const app = express();
// Allows CORS for connecting frontend with backend
app.use(cors())
// Converts the response body to JSON so Express can read it
app.use(express.json());

const database = {
  users: [
    {
      id: 1,
      name: 'Sunny',
      email: 'sunnyhebbar@hotmail.co.uk',
      password: 'password',
      entries: 0,
      joined: new Date()
    },
    {
      id: 2,
      name: 'Kim',
      email: 'kimjones92@hotmail.co.uk',
      password: 'password',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
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
});

app.post('/signup', (req, res) => {
  const {name, email, password} = req.body;
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
});

app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      user.length ? res.json(user[0]) : res.status(400).json('User profile not found')
    })
    .catch(err => res.status(400).json('Error getting user profile'));
});

app.put('/image', (req, res) => {
  const {id} = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    // Returns an object
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => res.status(400).json('Unable to get entries'))
});

// Middleware that listens on port 5000
app.listen(5000, () => {
  console.log('App is running on port 5000');
});
