
const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `dbname=d6ckl1lqt0g1q0 host=ec2-174-129-253-125.compute-1.amazonaws.com port=5432 user=gaptijtqgqopxh password=a2dfcc2e21eab1dd3ac6ce24a15fc13350d4933710d3f6465b817f42e0398e5c sslmode=require`

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
})

console.log('maybe made the connection')

module.exports = { pool }

console.log(pool)

const getUsers = (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error
    }
    Response.status(200).json(results.rows)
  })
}
console.log('defined getUsers')
// console.log(getUsers())

// Instructions for creating this config file were found in the following blog post:
// https://www.taniarascia.com/node-express-postgresql-heroku/

// SIMPLE QUERY, IT WORKS!
// pool.query('SELECT $1 AS value', 123)
//   .then(function (data) {
//     console.log('DATA:', data.value)
//   })
//   .catch(function (error) {
//     console.log('ERROR:', error)
//   })
