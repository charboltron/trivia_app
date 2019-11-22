
// These are the instructions from the Express website:
// https://expressjs.com/en/guide/database-integration.html#postgresql

const pgp = require('pg-promise')(/* options */)
// approach 1 - DOES NOT WORK
// var db = pgp('dbname=d6ckl1lqt0g1q0, host=ec2-174-129-253-125.compute-1.amazonaws.com, port=5432, user=gaptijtqgqopxh, password=a2dfcc2e21eab1dd3ac6ce24a15fc13350d4933710d3f6465b817f42e0398e5c, sslmode=require')
// const db = pgp('postgres://gaptijtqgqopxh:a2dfcc2e21eab1dd3ac6ce24a15fc13350d4933710d3f6465b817f42e0398e5c@ec2-174-129-253-125.compute-1.amazonaws.com:5432/d6ckl1lqt0g1q0')

// approach 2 - KINDA WORKS, BUT DOES NOT WORK
const cn = {
  database: 'd6ckl1lqt0g1q0',
  host: 'ec2-174-129-253-125.compute-1.amazonaws.com',
  port: '5432',
  user: 'gaptijtqgqopxh',
  password: 'a2dfcc2e21eab1dd3ac6ce24a15fc13350d4933710d3f6465b817f42e0398e5c',
  sslmode: 'require',
  ssl: 'on'
}
const db = pgp(cn)

// THIS SAMPLE QUERY IS THROWING ERRORS
// db.one('SELECT $1 AS value', 123)
//   .then(function (data) {
//     console.log('DATA:', data.value)
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error)
//   })

// ATTEMPTING THIS QUERY APPROACH FROM THE PG-PROMISE GITHUB PAGE
// https://github.com/vitaly-t/pg-promise/blob/master/examples/transaction.js
db.tx(async t => {
  const user = await t.one('INSERT INTO users(usrnm) VALUES($1) RETURNING usrnm', 'John');
  return {user};
})
  .then(({user}) => {
      // print new user username
      console.log('DATA:', user.usrnm);
  })
  .catch(error => {
      console.log('SHIT:', error); // print the error
  })
  .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
// For details see: https://github.com/vitaly-t/pg-promise#library-de-initialization




// These are the instructions from the Heroku website: 
// https://devcenter.heroku.com/articles/heroku-postgresql#designating-a-primary-database
// DOES NOT WORK, NEEDS MODERN ERROR CATCHING

// const { Client } = require('pg');

// const client = new Client({
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
// });

// client.connect();

// client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//         console.log(JSON.stringify(row));
//     }
//     client.end();
// });