const pgp = require('pg-promise')(/* options */)
const { PGDATABASE, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGSSLMODE, PGREQUIRESSL } = require('./config')

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

const createUser = (user_name, user_pwd) => {
    // const db = pgp(cn)
    // console.log('connected to psql db')
    console.log(`Adding ${user_name} to the database!`);
    db.tx(async t => {
        const user = await t.one(
            `INSERT INTO users(usrnm, usrpw) VALUES($1, $2) 
             ON CONFLICT DO NOTHING RETURNING usrnm,usrpw`, 
            [user_name, user_pwd]);
    return {user};
    })
    .then(({user}) => {
        // print new user
        console.log('DATA:', user);
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error
    })
    // .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
}

const getUserCount = (user_name, user_pwd, res) => {
    // const db = pgp(cn)
    console.log('connected to psql db')
    console.log(`looking for user ${user_name} in the database`)
    const usrCnt = db.tx(async t => {
        const userCount = await t.one(
            `SELECT COUNT(*) FROM users WHERE usrnm=$1`,[user_name]);
    console.log(userCount);
    return {userCount, res};
    })
    .then(({userCount, res}) => {
        console.log(`${user_name} occurs ${userCount.count} times`);
        if(userCount.count > 0) {
            console.log('program things count is greater than 0')
            // res.send(`<script>
            //   alert('Sorry this username is already taken, please try again.')
            //   </script>`);
            res.sendFile(__dirname+'/public/sign_up.html'); //need a better way to reload the page and clear current values
        } else {
            createUser(user_name, user_pwd);
            console.log(`user added`);
            // res.sendFile(__dirname+'/public/sign_up_success.html');
        }
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error
    })
    // .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
    }


module.exports = {
    createUser,
    getUserCount
}

db.$pool.end  
