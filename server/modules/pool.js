const pg = require('pg');
const url = require('url');

let config = {};

if (process.env.DATABASE_URL) {
  // Heroku gives a url, not a connection object:
  // https://github.com/Fetchinator7/node-pg-pool
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: { rejectUnauthorized: false },
    // Max number of clients in the pool
    max: 10,
    // How long a client is allowed to remain idle before being closed.
    idleTimeoutMillis: 30000
  };
} else {
  config = {
    host: 'localhost',
    port: 5432,
    database: process.env.DATABASE_NAME,
    // Max number of clients in the pool
    max: 10,
    // How long a client is allowed to remain idle before being closed.
    idleTimeoutMillis: 30000
  };
}

// This creates the pool that will be shared by all other modules.
const pool = new pg.Pool(config);

// The pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens.
pool.on('error', (err) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
