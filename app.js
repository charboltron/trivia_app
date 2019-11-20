const express = require('express');
const app = express();

var path = require('path');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('./public')));

app.get('/quick_game', function (req, res) {
    res.sendFile(__dirname+'/public/quick_game.html');
  })

app.get('/game_setup_solo', function (req, res) {
     //TODO: res.sendFile(__dirname+'/public/game_setup_solo.html');
     res.send('This is where the game setup will be (SOLO MODE)')
})

app.get('/game_setup_friend', function (req, res) {
    //TODO: res.sendFile(__dirname+'/public/game_setup_friend.html');
    res.send('This is where the game setup will be (FRIEND MODE)')
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('listening on port X000'));
