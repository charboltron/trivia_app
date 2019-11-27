const express = require('express');
const app = express();
const { PORT } = require('./config')
const db = require('./queries')

var path = require('path');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('./public')));

app.get('/', function (req, res) {
  console.log('home button pressed');
  res.sendFile(__dirname+'/public/index.html');
})

app.get('/quick_game', function (req, res) {
    res.sendFile(__dirname+'/public/quick_game.html');
  })

app.get('/game_setup_solo', function (req, res) {
     res.sendFile(__dirname+'/public/game_setup.html');
})

// app.get('/solo_game', function (req, res) {
//   res.sendFile(__dirname+'/public/html/solo_game.html');
// })

app.get('/game_setup_friend', function (req, res) {
    //TODO: res.sendFile(__dirname+'/public/game_setup_friend.html');
    res.send('This is where the game setup will be (FRIEND MODE)')
})

app.post('/sign_up_submit', async (req, res) =>{ 
  var user_name =  req.body.user_name.replace(/\s/g, '').trim(); 
  var user_pwd  =  req.body.user_pwd.trim();
  console.log(`attempting to add user name: ${user_name}`);
  var userAdded = await db.userCheckandAdd(user_name, user_pwd);
  console.log(`userAdded is ${userAdded}`);

  // runthis() => {
    if (userAdded != 1) { 
      // this means that some error was returned from the userCheckandAdd function
      res.send(`
        <script>alert('Sorry this username is already taken, please try again.');</script>
        <script>location.reload(true/false);</script>;
      `);      
      // res.redirect(__dirname+'/public/sign_up.html');
      // res.sendFile(__dirname+'/public/sign_up.html'); //need a better way to reload the page and clear current values
    } else {
      res.sendFile(__dirname+'/public/sign_up_success.html');
    }
  // }
})

app.get('/sign_up_submit', (req, res) => {
  res.sendFile(__dirname+'/public/sign_up.html');
})

app.get('/', function (req, res) {
  console.log('home button pressed');
  res.sendFile(__dirname+'/public/index.html');
})

// const PORT = process.env.PORT || 3000; // THIS MOVED TO ENVIRONMENT VARIABLES
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
