const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');

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

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => signin.handleSignIn(req, res, db, bcrypt));

app.post('/signup', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profile/:id', (req, res) => profile.handleGetProfile(req, res, db));

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
