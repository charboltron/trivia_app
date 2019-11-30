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
  
  // fix code starting here
  var userSignedIn = await db.userSignIn(user_name, user_pwd);
  console.log(`userSignedIn is ${userSignedIn}`);

  if (userSignedIn != 1) { 
    // this means that some error was returned from the userCheckandAdd function
    res.send(`
      <script>alert('Sorry this user name and password does not match our records. Please try again.');</script>
      <script>window.location.replace('sign_in.html');</script>;
    `);
  } else {
    res.sendFile(__dirname+'/public/sign_in_success.html');
  }

})

app.get('/sign_in_submit', (req, res) => {
  res.sendFile(__dirname+'/public/sign_up.html');
})

app.post('/delete_user_account', async (req, res) =>{ 
  var user_name = 'Tyler'; //For testing of course
  //var user_name =  req.body.user_name. However we determine how to do this. 
  var userDeleted = await db.deleteUser(user_name);
  console.log(`return from userDeleted in app: User Deleted = ${userDeleted}`);
  if(userDeleted){
    console.log(`User ${user_name} has been deleted from the database.`);
    res.send(`
    <script>alert('Sorry this user name and password does not match our records. Please try again.');</script>
    <script>window.location.replace('sign_in.html');</script>;
  `);
  }
})

app.get('/', function (req, res) {
  console.log('home button pressed');
  res.sendFile(__dirname+'/public/index.html');
})

// const PORT = process.env.PORT || 3000; // THIS MOVED TO ENVIRONMENT VARIABLES
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
