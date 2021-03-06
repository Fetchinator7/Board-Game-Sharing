const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Get all the games for the current user and add any loans into the game object as an array.
router.get('/games', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  const queryText = `SELECT "user_owned_game".game_id, "bgg_game_id", 
                    "game_img", "title", "player_range", "playtime",
                    "user_owned_game".comments FROM "game"
                    INNER JOIN "user_owned_game" ON "game".game_id="user_owned_game".game_id
                    WHERE "user_owned_game".user_id = $1 ORDER BY "title";`;
  pool.query(queryText, [userID])
    .then(allUsersGames => {
      // Now that we have all the user's games, get all the loan times for those games
      // and add those to the game object as an array.
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
              // Every single loan was returned from the query, but only add the loans
              // to the current game object where the game_ids match.
              loans: allUsersGameLoans.rows.filter(game => game.game_id === ownedGame.game_id)
            };
            return infoObj;
          }));
        });
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// Get all the notifications for the logged in user.
router.get('/notifications', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  // TODO change this to also get viewed notifications? Archived section?
  const queryText = `SELECT "alert_id", "created_at", "alert_text", "loaned_game_id", "friend_request_id"
                    FROM "alert" WHERE "viewed_at" IS NULL AND user_id = $1;`;
  pool.query(queryText, [userID])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// Update the profile privacy setting for the current user.
router.put('/settings-privacy', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  const newVisibility = req.body.newVisibility;
  const queryText = 'UPDATE users SET visibility = $1 WHERE user_id = $2;';
  pool.query(queryText, [newVisibility, userID])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = encryptLib.encryptPassword(req.body.password);
  const queryText = "INSERT INTO users (user_name, email, password, visibility) VALUES ($1, $2, $3, '1') RETURNING user_id;";
  pool.query(queryText, [username, email, password])
    .then(() => res.sendStatus(201))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;
