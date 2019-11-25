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

app.post('/sign_up_submit', (req, res) =>{ 
  var user_name =  req.body.user_name.trim(); 
  var user_pwd  =  req.body.user_pwd.trim();
  db.createUser(user_name, user_pwd);
  res.sendFile(__dirname+'/public/sign_up_success.html');
  // if(/*user name already in database*/){
  //    console.log("User already in database!");  
  // }else if(user_name.length > 32){
  //   //do something
  // }else {
  
  // }
})

// const PORT = process.env.PORT || 3000; // THIS MOVED TO ENVIRONMENT VARIABLES
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
