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
        // print new user username
        console.log('DATA:', user);
    })
    .catch(error => {
        console.log('ERROR:', error); // print the error
    })
    .finally(db.$pool.end); // For immediate app exit, shutting down the connection pool
}
    // const { name, email } = request.body
    
    // db.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
    //     if (error) {
    //     throw error
    //     }
    //     response.status(201).send(`User added with ID: ${result.insertId}`)
    // })

module.exports = {
    createUser
}

// const getUsers = (request, response) => {
//     db.query('SELECT * FROM users', (error, results) => {
//         if (error) {
//         throw error
//         }
//         response.status(200).json(results.rows)
//     })

// const getUserById = (request, response) => {
//     const id = parseInt(request.params.id)
  
//     pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).json(results.rows)
//     })
//   }
  
//   const createUser = (request, response) => {
//     const { name, email } = request.body
  
//     pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(201).send(`User added with ID: ${result.insertId}`)
//     })
//   }
  
//   const updateUser = (request, response) => {
//     const id = parseInt(request.params.id)
//     const { name, email } = request.body
  
//     pool.query(
//       'UPDATE users SET name = $1, email = $2 WHERE id = $3',
//       [name, email, id],
//       (error, results) => {
//         if (error) {
//           throw error
//         }
//         response.status(200).send(`User modified with ID: ${id}`)
//       }
//     )
//   }
  
//   const deleteUser = (request, response) => {
//     const id = parseInt(request.params.id)
  
//     pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
//       if (error) {
//         throw error
//       }
//       response.status(200).send(`User deleted with ID: ${id}`)
//     })
//   }
  