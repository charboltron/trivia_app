const express = require('express');
const app = express();
const { PORT } = require('./config')
const db = require('./queries')

var path = require('path');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('./public')));

app.get('/quick_game', function (req, res) {
    res.sendFile(__dirname+'/public/quick_game.html');
  })

app.get('/game_setup_solo', function (req, res) {
     res.sendFile(__dirname+'/public/game_setup.html');
})

app.get('/game_setup_friend', function (req, res) {
    //TODO: res.sendFile(__dirname+'/public/game_setup_friend.html');
    res.send('This is where the game setup will be (FRIEND MODE)')
})

app.post('/sign_up_submit', (req, res) =>{ 
  let user_name =  req.body.user_name; 
  let user_pwd  =  req.body.user_pwd;
  db.addJohn();
  res.write(`user name: ${user_name}`);
  res.end();
  // if(/*user name already in database*/){
  //    console.log("User already in database!");  
  // }else if(user_name.length > 32){
  //   //do something
  // }else {
  
  // }
})




// const PORT = process.env.PORT || 3000; // THIS MOVED TO ENVIRONMENT VARIABLES
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
