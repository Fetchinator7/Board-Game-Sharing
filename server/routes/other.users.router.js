const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/username/:search', (req, res) => {
  const search = req.params.search;
  console.log('search for username:', search);
  pool.query('SELECT user_name, user_id FROM users WHERE "visibility" <= 1 AND user_name ILIKE $1', [`%${search}%`])
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

router.get('/user/ID/:userName', (req, res) => {
  const userName = req.params.userName;
  const queryText = 'SELECT "user_id" FROM "users" WHERE "user_name" = $1;';
  pool.query(queryText, [userName])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

router.get('/user/profile/:userName', (req, res) => {
  const userName = req.params.userName;
  const queryText = 'SELECT "user_id" FROM "users" WHERE "visibility" <= 2 AND user_name = $1;';
  pool.query(queryText, [userName])
    .then(queryResponse => {
      console.log(queryResponse);
      if (queryResponse.rows[0]) {
        // If there profile is 1: Public or 2: Those with the link then show all the game results.
        const userID = queryResponse.rows[0].user_id;
        const queryText = `SELECT "user_owned_game".game_id, "bgg_game_id", 
                            "game_img", "title", "player_range", "playtime",
                            "user_owned_game".comments FROM "game"
                            INNER JOIN "user_owned_game" ON "game".game_id="user_owned_game".game_id
                            WHERE "user_owned_game".user_id = $1;`;
        pool.query(queryText, [userID])
          .then(allUsersGames => {
            const loanedGamesQuery = `SELECT "loaned_game".game_id, "friend_id", "loan_start",
                                        "loan_end", "agreed", "viewed"
                                        FROM user_owned_game
                                        JOIN loaned_game
                                        ON user_owned_game.game_id = loaned_game.game_id
                                        WHERE owner_id = $1`;
            pool.query(loanedGamesQuery, [userID])
              .then(allUsersGameLoans => {
                res.send(allUsersGames.rows.map(ownedGame => {
                  const infoObj = {
                    ...ownedGame,
                    loans: allUsersGameLoans.rows.filter(game => game.game_id === ownedGame.game_id)
                  };
                  return infoObj;
                }));
              });
          });
      } else {
        res.sendStatus(403);
      }
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

router.post('/friend-request', rejectUnauthenticated, (req, res) => {
  const userID = req.body.userID;
  const friendRequestUserID = req.body.friendRequestUserID;
  const message = req.body.message;
  const queryText = 'INSERT INTO "friend_request" ("from_user_id", "to_user_id", "message") VALUES ($1, $2, $3);';
  pool.query(queryText, [userID, friendRequestUserID, message])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

router.post('/borrow-game-request', rejectUnauthenticated, (req, res) => {
  const gameID = req.body.gameID;
  const userID = req.body.userID;
  const ownerID = req.body.ownerID;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  console.log('gameID', gameID, 'userID', userID, 'ownerID', ownerID, 'startDate', startDate, 'endDate', endDate);
  const queryText = 'INSERT INTO "loaned_game" ("game_id", "owner_id", "friend_id", "loan_start", "loan_end") VALUES ($1, $2, $3, $4, $5);';
  pool.query(queryText, [gameID, ownerID, userID, startDate, endDate])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

module.exports = router;
