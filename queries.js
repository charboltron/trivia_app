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

const createUser = async (user_name, user_pwd) => {
    // const db = pgp(cn)
    // console.log('connected to psql db')
    console.log(`Adding ${user_name} to the database!`);
    await db.tx(async t => {
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

const userCheckandAdd = async (user_name, user_pwd) => {
    // const db = pgp(cn)
    console.log('connected to psql db')
    console.log(`looking for user ${user_name} in the database`)
    var canAdd = 0;
    await db.tx(async t => {
        const userCount = await t.one(
            `SELECT COUNT(*) FROM users WHERE usrnm=$1`,[user_name]);
    console.log(`userCount is ${userCount.count}`);
    return {userCount};
    })
    .then( async ({userCount}) => {
        console.log(`${user_name} occurs ${userCount.count} times`);
        if(userCount.count > 0) {
            console.log('program things count is greater than 0');
        } else {
            await createUser(user_name, user_pwd);
            console.log(`user added`);
            canAdd = 1;
        }
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error
    })
    // .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
    return canAdd;
}

const userSignIn = async (user_name, user_pwd) => {
    // const db = pgp(cn)
    console.log('connected to psql db')
    console.log(`looking for user ${user_name} in the database`)
    var canSignIn = 0;
    await db.tx(async t => {
        const userCount = await t.one(
            `SELECT COUNT(*) FROM users WHERE usrnm=$1 AND usrpw=$2`,[user_name, user_pwd]);
    console.log(`userCount is ${userCount.count}`);
    return {userCount};
    })
    .then( async ({userCount}) => {
        console.log(`${user_name} occurs ${userCount.count} times`);
        if(userCount.count == 0) {
            console.log('database cannot find user & password combination');
        } else {
            console.log(`user signed in`);
            canSignIn = 1;
        }
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error
    })
    // .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
    return canSignIn;
}

const deleteUser = async (user_name) => {
    // const db = pgp(cn)
    // console.log('connected to psql db')
    console.log(`Deleting ${user_name} from the database!`);
    const result = await db.tx(async t => {
        await t.one(
            `DELETE FROM users WHERE usrnm = $1`, [user_name]);
    })
    .then(result => {
        // print new user
        console.log(`DATA: ${result}`);
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error
    })
    // .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
    return 1;
}

module.exports = {
    createUser,
    userCheckandAdd,
    userSignIn,
    deleteUser
}

db.$pool.end  
