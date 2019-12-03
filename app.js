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

  //res.send(`Currently signed in is: ${app.locals.current_signed_in_user}`);
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
  
  var user_name =  req.body.user_name.trim();
  var user_pwd = req.body.user_pwd.trim();

  //User Name input validation checking
  if(user_name.indexOf(' ') >= 0){
    res.send(`
    <script>alert('Sorry, usernames may not contain blank spaces, please try again.');</script>
    <script>window.location.replace('sign_up.html');</script>;
  `);
  return;    
  }else if(user_name.length > 30){
    res.send(`
    <script>alert('Sorry usernames must be less than 30 characters, please try again.');</script>
    <script>window.location.replace('sign_up.html');</script>;
    `);    
  return;
  } 
  
  //Password input validation checking
  if(user_pwd.length === 0){
    console.log("password length is 0");
    res.send(`
      <script>alert('Sorry, the password field may not be blank, please try again.');</script>
      <script>window.location.replace('sign_up.html');</script>;
    `);
  return;
  } else if(user_pwd.indexOf(' ') >= 0){
      console.log("password has spaces");
      res.send(`
      <script>alert('Sorry, currently passwords may not contain blank spaces, please try again.');</script>
      <script>window.location.replace('sign_up.html');</script>;
    `);
  return;
  } else if(user_pwd.length > 128){
      console.log("password too long");
      res.send(`
        <script>alert('Sorry, passwords must be less than 128 characters, please try again.');</script>
        <script>window.location.replace('sign_up.html');</script>;
    `);    
  return;
  }    
  console.log(`attempting to add user name: ${user_name}`);

  //Calling postgreSQL database methods to check that user doesn't exist and add if possible 
  var userAdded = await db.userCheckandAdd(user_name, user_pwd);
  console.log(`userAdded is ${userAdded}`);
  if (userAdded != 1) { 
    res.send(`
      <script>alert('Sorry this username is already taken, please try again.');</script>
      <script>window.location.replace('sign_up.html');</script>;
    `);      
    return;
  } else {
    res.sendFile(__dirname+'/public/sign_up_success.html');
    return;
    }
})

//Not sure if this route is actually in use right now.
app.get('/sign_up_submit', (req, res) => {
  res.sendFile(__dirname+'/public/sign_up.html');
})



app.post('/sign_in_submit', async (req, res) =>{ 
  var user_name =  req.body.user_name.replace(/\s/g, '').trim(); 
  var user_pwd  =  req.body.user_pwd.trim();
  console.log(`attempting to sign in user: ${user_name}`);
  
  var userSignedIn = await db.userSignIn(user_name, user_pwd);
  console.log(`userSignedIn value is 1 if correctly signed in: ${userSignedIn}`);

  if (userSignedIn != 1) { 
    // this means that some error was returned from the userCheckandAdd function
    res.send(`
      <script>alert('Sorry this user name and password does not match our records. Please try again.');</script>
      <script>window.location.replace('sign_in.html');</script>;
    `);
  } else {
    req.app.locals.current_signed_in_user = user_name;
    console.log(`In app.js: setting signed in user to to ${user_name}`)
    res.sendFile(__dirname+'/public/sign_in_success.html');
  }
})



app.post('/delete_user_account', async (req, res) =>{ 
  var user_name = 'Tyler'; //For testing of course
  //var user_name =  req.body.user_name. However we determine how to do this. 
  var userDeleted = await db.deleteUser(user_name);
  console.log(`return from userDeleted in app: User Deleted = ${userDeleted}`);
  if(userDeleted){
    console.log(`User ${user_name} has been deleted from the database.`);
        res.send(`
      <script>alert('We are sorry to see you go, but we understand. Thanks for joining and you are welcome back anytime. Goodbye!');</script>
      <script>window.location.replace('index.html');</script>;
    `);
  }
})



app.get('/', function (req, res) {
  console.log('home button pressed');
  res.sendFile(__dirname+'/public/index.html');
})



app.post('/log_new_game', async (req, res) => {
  var user_name = req.body.userName.trim();
  var trivia = req.body.triviaQuestions;
  var total_questions = req.body.totalQuest;
  var score = req.body.score;
  var newGameLogged = await db.logNewGame(user_name, trivia, total_questions, score);  
  if (newGameLogged != 0) {
    console.log(`return from logNewGame, successfully added game id: ${newGameLogged}`);
    req.app.locals.current_game_id = newGameLogged;
    console.log(`app local variable current_game_id is: ${req.app.locals.current_game_id}`);
    // res.send(`<script>game_id = ${newGameLogged};</script>;`);
    // res.json({game_id : newGameLogged});
    // res.format({'text/plain': function() { res.write(newGameLogged.toString()); }});
    // res.write(newGameLogged.toString());
    // res.end;
    // console.log(res);
  }
})



app.post('/update_game_score', async (req, res) => {
  var db_user_name = req.body.updatescore_user_id;
  var db_score = req.body.updatescore_score;
  var db_game_id = req.app.locals.current_game_id;
  console.log(`user name is ${db_user_name}`);
  console.log(`score is ${db_score}`);
  console.log(`game id is: ${db_game_id}`);
  var gameScoreUpdated = await db.updateGameScore(db_user_name, db_score, db_game_id);
  if (gameScoreUpdated != 0) {
    console.log(`return from newGameScoreUpdated, successfully updated score to: ${gameScoreUpdated}`);
  } else {
    console.log('returned from gameScoreUpdated, there may be a problem')
  }
})



app.get('/leaderboard', async (req, res) => {
  console.log('get leaderboard route');
  var leaders = await db.qryLeaderboard();
  console.log(`Witness... the leaders!`);
  console.log(leaders);
  // res.setHeader('Content-Type', 'application/json');
  res.json(leaders);

})



// const PORT = process.env.PORT || 3000; // THIS MOVED TO ENVIRONMENT VARIABLES
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
