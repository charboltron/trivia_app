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

    const result = await db.result('DELETE FROM users WHERE usrnm = $1', [user_name], r => r.rowCount)
    .then(count => {
        // count = number of rows deleted
        console.log(`Deleted ${count} rows from the database.`)
    })
    .catch(error => {
        console.log(error);
    })
    // .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
    return 1;
}



const logNewGame = async (user_name, trivia, total_questions, score) => {
    console.log(`logging new game`);
    var canLogGame = 0;
    await db.tx(async t => {
        const result = await t.one(
            `INSERT INTO scores
            (usrnm, friend_usrnm, trivia, total_questions, score)
            VALUES ($1, 'none', $2, $3, $4)
            RETURNING id`,
            [user_name, trivia, total_questions, score]
        );
        console.log(result);
        return {result};
    })
    .then( async ({result}) => {
        if ({result}) {
            console.log(`added game id ${result.id} to scores`)
            canLogGame = result.id;
        } else {
            console.log(`looks like the new game was not logged`);
        }
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error
    })
    return canLogGame;
}



const updateGameScore = async (user_name, score, game_id) => {
    console.log(`updating game score`);

    var canUpdateScore = 0;
    await db.tx(async t => {
        const results = await t.one(
            `UPDATE scores
            SET score = $3
            WHERE ( usrnm = $1
                    AND id = $2 )
            RETURNING score;`,
            [user_name, game_id, score]
        );
        console.log(results);
        return {results};
    })
    .then( async ({results}) => {
        if ({results}) {
            console.log(`game score updated to ${results.score}`);
            canUpdateScore = results.score;
        } else {
            console.log('sigh... I guess were unable to update the game score in the system');
        }
    })
    .catch(error => {
        console.log(`ERROR: `,error);
    })
    return canUpdateScore;
}



const qryLeaderboard = async () => {
    console.log('querying the leaderboard');
    let leaderboard = 'empty';
    await db.tx( async t => {
        await t.none(
            `UPDATE scores
            SET usrnm = 'Guest'
            WHERE 
                usrnm IS NULL 
                OR usrnm = ''
                OR usrnm = 'test';`
        );
        const leaders = await t.many(
            `SELECT usrnm as user, count(id) as game_count, (sum(score)/count(id)) as avg_score, sum(score) as total_score
            FROM scores
            WHERE usrnm IS NOT NULL AND usrnm <> ''
            GROUP BY usrnm
            ORDER BY total_score DESC;`);
        return {leaders};
    })
    .then( async ({leaders}) => {
        if ({leaders}) {
            console.log(`leaderboard generated`);
            console.log(leaders);
            leaderboard = leaders;
        } else {
            console.log('could not generate leaders, we are in anarchy!');
        }
    })
    .catch(error => {
        console.log(`ERROR: `,error);
    })
    return leaderboard;
}



module.exports = {
    createUser,
    userCheckandAdd,
    userSignIn,
    deleteUser,
    logNewGame,
    updateGameScore,
    qryLeaderboard
}

db.$pool.end  
