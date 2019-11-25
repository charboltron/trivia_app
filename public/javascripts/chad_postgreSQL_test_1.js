
// These are the instructions from the Express website:
// https://expressjs.com/en/guide/database-integration.html#postgresql

const pgp = require('pg-promise')(/* options */)
const { PORT, DATABASE_URL, HTTP_TIMEOUT, PSQL_CONNECTION, PGDATABASE, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGSSLMODE, PGREQUIRESSL } = require('./config')
console.log('howdy')

// const cn = {
//   database: 'd6ckl1lqt0g1q0',
//   host: 'ec2-174-129-253-125.compute-1.amazonaws.com',
//   port: '5432',
//   user: 'gaptijtqgqopxh',
//   password: 'a2dfcc2e21eab1dd3ac6ce24a15fc13350d4933710d3f6465b817f42e0398e5c',
//   sslmode: 'require',
//   ssl: 'on'
// }
// const db = pgp(cn)
console.log(`port is ${PORT}`)
console.log(`pg database is ${PGDATABASE}`)
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


// https://github.com/vitaly-t/pg-promise/blob/master/examples/transaction.js
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

// SIMPLE QUERY, IT WORKS!
// db.one('SELECT $1 AS value', 123)
//   .then(function (data) {
//     console.log('DATA:', data.value)
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error)
//   })