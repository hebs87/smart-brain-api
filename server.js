const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const morgan = require('morgan');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

dotenv.config();

let dbConfig = {};
if (process.env.NODE_ENV === 'development') {
  dbConfig = {
    client: 'pg',
    connection: process.env.DATABASE_URL
  };
} else {
  dbConfig = {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: true
    }
  };
}

const db = knex(dbConfig);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const app = express();
// Allows CORS for connecting frontend with backend
app.use(cors())
// Converts the response body to JSON so Express can read it
app.use(express.json());
// Instantiate morgan for logging
app.use(morgan('combined'));

app.get('/', (req, res) => res.send('It is working'));

// Alternative syntax with curried controller function - req and res arguments are automatically inherited
app.post('/signin', signin.handleSignIn(db, bcrypt));

app.post('/signup', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profile/:id', (req, res) => profile.handleGetProfile(req, res, db));

app.post('/profile/:id', (req, res) => profile.handleUpdateProfile(req, res, db));

app.put('/image', (req, res) => image.incrementImageCount(req, res, db));

// Middleware that listens on specified port
app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
