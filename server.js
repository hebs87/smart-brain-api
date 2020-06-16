const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

dotenv.config();

// DB config for development
// const db = knex({
//   client: 'pg',
//   connection: {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
//   }
// });

// DB config for production
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();
// Allows CORS for connecting frontend with backend
app.use(cors())
// Converts the response body to JSON so Express can read it
app.use(express.json());

app.get('/', (req, res) => res.send(database.users));

// Alternative syntax with curried controller function - req and res arguments are automatically inherited
app.post('/signin', signin.handleSignIn(db, bcrypt));

app.post('/signup', (req, res) => register.handleRegister(req, res, db, bcrypt));

app.get('/profile/:id', (req, res) => profile.handleGetProfile(req, res, db));

app.put('/image', (req, res) => image.incrementImageCount(req, res, db));

// Middleware that listens on specified port
app.listen(process.env.PORT, () => {
  console.log(`App is running on port ${process.env.PORT}`);
});
