const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/username/:search', (req, res) => {
  const search = req.params.search;
  console.log('search for username:', search);
  pool.query('SELECT user_name, user_id FROM users WHERE user_name ILIKE $1', [`%${search}%`])
    .then(results => {
      console.log('users', results.rows);
      res.send(results.rows);
    })
    .catch(error => {
      console.log('Error making SELECT for user_name:', error);
      res.sendStatus(500);
    });
});

router.get('/friends/:userID', rejectUnauthenticated, (req, res) => {
  const userID = req.params.userID;
  const queryText = `SELECT "friend".friend_id, "users".user_name 
                    FROM "friend"
                    JOIN "users" ON "friend".friend_id="users".user_id
                    WHERE "friend".user_id = $1;`;
  pool.query(queryText, [userID])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

module.exports = router;
