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
// const db = pgp(cn)

const createUser = (user_name, user_pwd) => {

    const db = pgp(cn)
    console.log('connected to psql db')
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
    .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
}

const selectUser = (user_name) => {
    const db = pgp(cn)
    console.log('connected to psql db')
    console.log(`looking for user ${user_name} in the database`)
    db.tx(async t => {
        const user = await t.one(
            `SELECT usrnm FROM users WHERE usrnm=$1`,[user_name]);
    return {user};
    })
    .then(({user}) => {
        console.log(`user ${user_name} already exists, please select another user name`);
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error
    })
    .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
}

module.exports = {
    createUser,
    selectUser
}

  

  