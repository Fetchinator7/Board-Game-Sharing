const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const moment = require('moment');

const router = express.Router();

router.get('/username/:search', (req, res) => {
  const search = req.params.search;
  pool.query('SELECT user_name, user_id FROM users WHERE "visibility" <= 1 AND user_name ILIKE $1', [`%${search}%`])
    .then(results => {
      res.send(results.rows);
    })
    .catch(error => {
      console.log('Error making SELECT for user_name:', error);
      res.sendStatus(500);
    });
});

router.get('/friends', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  // Friends are in pairs, so get the pairs where the current user is first because a friend accepted their request.
  // but the second one will get the ones where this user accepted a friend request.
  // For example, if the user is 15 and has the friends 13, 16, 17 in this configuration:
  // (15, 13), (16, 15), (17, 15)
  // this query selects the first pair where 15 is first, and the next query selects the two where 15 is second.
  const userIsUserID = `SELECT "friend".friend_id, "users".user_name 
                        FROM "friend"
                        JOIN "users" ON "friend".friend_id="users".user_id
                        WHERE "friend".user_id = $1;`;
  pool.query(userIsUserID, [userID])
    .then(queryResponse => {
      const userIsFriendID = `SELECT "friend".user_id as "friend_id", "users".user_name 
                              FROM "friend"
                              JOIN "users" ON "friend".user_id="users".user_id
                              WHERE "friend".friend_id = $1;`;
      pool.query(userIsFriendID, [userID])
        .then(friendUserResponse => {
          res.send([...queryResponse.rows, ...friendUserResponse.rows]);
        });
    })
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

router.post('/other-user-request', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  const otherUsersUserName = req.user.user_name;
  const otherUserID = req.body.otherUserID;
  const now = moment();
  const actionType = req.body.actionType;
  if (actionType === 'friend') {
    const message = req.body.message;
    const friendAlertText = `The user with the user name "${otherUsersUserName}" wants to be your friend and said: "${message}"`;
    const friendRequestQueryText = 'INSERT INTO "friend_request" ("from_user_id", "to_user_id", "message") VALUES ($1, $2, $3) returning "request_id";';
    pool.query(friendRequestQueryText, [userID, otherUserID, message])
      .then(friendRequestQueryResponse => {
        console.log('friendRequestQueryResponse', friendRequestQueryResponse);
        const queryText = 'INSERT INTO "alert" ("user_id", "created_at", "alert_text", "friend_request_id") VALUES ($1, $2, $3, $4);';
        pool.query(queryText, [otherUserID, now, friendAlertText, friendRequestQueryResponse.rows[0].request_id])
          .then(queryResponse => res.send(queryResponse));
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  } else if (actionType === 'loan') {
    const gameID = req.body.gameID;
    const gameTitle = req.body.gameTitle;
    const startDate = moment(req.body.startDate);
    const endDate = moment(req.body.endDate);
    console.log(startDate, endDate);
    const borrowGameQueryText = 'INSERT INTO "loaned_game" ("game_id", "owner_id", "friend_id", "loan_start", "loan_end") VALUES ($1, $2, $3, $4, $5) returning "loan_id";';
    pool.query(borrowGameQueryText, [gameID, otherUserID, userID, startDate, endDate])
      .then(loanRequestQueryResponse => {
        console.log('otherUserID', otherUserID);
        console.log('loanRequestQueryResponse', loanRequestQueryResponse);
        const loanQueryText = 'INSERT INTO "alert" ("user_id", "created_at", "alert_text", "loaned_game_id") VALUES ($1, $2, $3, $4);';
        const loanAlertText = `Your friend with the user name "${otherUsersUserName}" wants to borrow your game: "${gameTitle}" from ${startDate.format('MM/DD')}-${endDate.format('MM/DD')}`;
        pool.query(loanQueryText, [otherUserID, now, loanAlertText, loanRequestQueryResponse.rows[0].loan_id])
          .then(queryResponse => res.send(queryResponse));
      })
      .catch((error) => {
        console.log(error);
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(400);
  }
});

// TODO combine these two into the same action based on whether loanedGameID or friendRequestID is null.
router.post('/update-borrow-game-request', rejectUnauthenticated, (req, res) => {
  const viewedAt = moment();
  const alertID = req.body.alertID;
  const agreed = req.body.agreed;
  const userID = req.user.user_id;
  const loanedGameID = req.body.loanedGameID;
  console.log(viewedAt, alertID, agreed, userID);
  const updateAlertText = 'UPDATE "alert" SET "viewed_at" = $1 WHERE alert_id = $2 AND user_id = $3;';
  const updateLoanText = 'UPDATE "loaned_game" SET "agreed" = $1, "viewed" = TRUE WHERE "loan_id" = $2 AND owner_id = $3;';
  pool.query(updateAlertText, [viewedAt, alertID, userID])
    .then(() =>
      pool.query(updateLoanText, [agreed, loanedGameID, userID])
        .then(updateResponse => {
          res.send(updateResponse);
        }))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// TODO only allow a notification to be created for the signed in user, and
router.post('/update-friend-request', rejectUnauthenticated, (req, res) => {
  const viewedAt = moment();
  const alertID = req.body.alertID;
  const agreed = req.body.agreed;
  const userID = req.user.user_id;
  const friendRequestID = req.body.friendRequestID;
  console.log(viewedAt, alertID, agreed, userID);
  console.log(userID, friendRequestID);
  const updateAlertText = 'UPDATE "alert" SET "viewed_at" = $1 WHERE alert_id = $2 AND user_id = $3;';
  const updateFriendRequestText = 'UPDATE "friend_request" SET "answered" = TRUE, "accepted" = $1 WHERE "request_id" = $2 AND to_user_id = $3 returning from_user_id;';
  const addFriendRelationText = 'INSERT INTO "friend" ("user_id", "friend_id") VALUES ($1, $2);';
  pool.query(updateAlertText, [viewedAt, alertID, userID])
    .then(() =>
      pool.query(updateFriendRequestText, [agreed, friendRequestID, userID])
        .then(friendID =>
          agreed && pool.query(addFriendRelationText, [friendID.rows[0].from_user_id, userID])
            .then(updateResponse => {
              res.send(updateResponse);
            }))
    )
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

module.exports = router;
