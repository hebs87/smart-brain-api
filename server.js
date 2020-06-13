const express = require('express');

const app = express();
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
      id: 1,
      name: 'Kim',
      email: 'kimjones92@hotmail.co.uk',
      password: 'password',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send('<h1>This is working</h1>');
});

app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password) {
    res.json('Success');
  } else {
    res.status(400).json('Error logging in')
  }
});

// Middleware that listens on port 3000
app.listen(3000, () => {
  console.log('App is running on port 3000');
})

/*
ROUTES
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = updated user
*/
