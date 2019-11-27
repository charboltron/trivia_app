
// you can comment these two lines out if you use the verbose script to pre-load the env vars
// const dotenv = require('dotenv');
// dotenv.config();

// TODO figure how this will work in heroku

module.exports = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    HTTP_TIMEOUT: process.env.HTTP_TIMEOUT,
    PSQL_CONNECTION: process.env.PSQL_CONNECTION,
    PGDATABASE: process.env.PGDATABASE,
    PGHOST: process.env.PGHOST,
    PGPORT: process.env.PGPORT,
    PGUSER: process.env.PGUSER,
    PGPASSWORD: process.env.PGPASSWORD,
    PGSSLMODE: process.env.PGSSLMODE,
    PGREQUIRESSL: process.env.PGREQUIRESSL
  };