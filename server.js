const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('this is working');
})

// Middleware that listens on port 3000
app.listen(3000, () => {
  console.log('app is running on port 3000');
})

/*
ROUTES
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT = updated user
*/
