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

router.get('/user/profile/:userName', (req, res) => {
  const userName = req.params.userName;
  const queryText = 'SELECT "visibility", "user_id" FROM "users" WHERE user_name = $1;';
  pool.query(queryText, [userName])
    .then(queryResponse => {
      if (queryResponse.rows[0]) {
        const visibility = queryResponse.rows[0].visibility <= 2;
        console.log(visibility);
        // If there profile is 1: Public or 2: Those with the link then show all the game results.
        if (visibility) {
          return res.send(getSignedOutUsersGames(queryResponse.rows[0].user_id));
        } else {
          return res.sendStatus(403);
        }
        // return res.sendStatus(407);
      }
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

function getSignedOutUsersGames(userName) {
  const queryText = '';
  pool.query(queryText, [userName])
    .then(queryResponse => {
      console.log('queryResponse', queryResponse);
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}

module.exports = router;
