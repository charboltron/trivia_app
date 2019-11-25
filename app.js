const express = require('express');
const app = express();
const pgp = require('pg-promise')(/* options */)
const { PORT, DATABASE_URL, HTTP_TIMEOUT, PSQL_CONNECTION, PGDATABASE, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGSSLMODE, PGREQUIRESSL } = require('./public/javascripts/config')


var path = require('path');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join('./public')));

app.get('/quick_game', function (req, res) {
    res.sendFile(__dirname+'/public/html/quick_game.html');
  })

app.get('/game_setup_solo', function (req, res) {
     res.sendFile(__dirname+'/public/html/game_setup.html');
})

app.get('/game_setup_friend', function (req, res) {
    //TODO: res.sendFile(__dirname+'/public/game_setup_friend.html');
    res.send('This is where the game setup will be (FRIEND MODE)')
})


console.log(`database is ${PGDATABASE}`)

const cn = {
  database: PGDATABASE,
  host: PGHOST,
  port: PGPORT,
  user: PGUSER,
  password: PGPASSWORD,
  sslmode: PGSSLMODE,
  ssl: PGREQUIRESSL
}
const db = pgp(cn)

db.tx(async t => {
  const user = await t.one('INSERT INTO users(usrnm, usrpw) VALUES($1, $2) ON CONFLICT DO NOTHING RETURNING usrnm,usrpw', ['John', '111']);
  return {user};
})
  .then(({user}) => {
      // print new user username
      console.log('DATA:', user);
  })
  .catch(error => {
      console.log('ERROR:', error); // print the error
  })
  .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool



// const PORT = process.env.PORT || 3000; // THIS MOVED TO ENVIRONMENT VARIABLES
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
