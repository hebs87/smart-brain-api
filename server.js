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
  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('Error logging in')
  }
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
  let found = false;
  database.users.forEach(user => {
    if (user.id === Number(id)) {
      found = true;
      return res.json(user);
    }
  })
  if (!found) res.status(404).json('No such user');
});

app.put('/image', (req, res) => {
  const {id} = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === Number(id)) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (!found) res.status(404).json('No such user');
});

// Middleware that listens on port 5000
app.listen(5000, () => {
  console.log('App is running on port 5000');
});
