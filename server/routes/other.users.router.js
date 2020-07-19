const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');
const moment = require('moment');

const router = express.Router();

// Search for users in the database with usernames containing the input, but only
// returning users whose privacy level is (1) public.
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

// Get the ids and user names for all the friends the current user has.
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

// Get just the user id for the user with the input user name.
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

// Get all the games for the input user name assuming their privacy level is (1) Public
// or (2) Only those with the link and add the loan time frames.
router.get('/user/profile/:userName', (req, res) => {
  const userName = req.params.userName;
  const queryText = 'SELECT "user_id" FROM "users" WHERE "visibility" <= 2 AND user_name = $1;';
  pool.query(queryText, [userName])
    .then(queryResponse => {
      if (queryResponse.rows[0]) {
        // If a result was found (the user exists and their profile is public) get all the
        // games (objects) that they own in an array.
        const userID = queryResponse.rows[0].user_id;
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

// This route handles scheduling and notification messages so since a friend request and
// game loan request are similar this excepts two "modes": friend and loan.
// If the mode is friend then make a row in the friend_request table which is pulled from
// whenever the user logs in.
router.post('/other-user-request', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  const otherUsersUserName = req.user.user_name;
  const otherUserID = req.body.otherUserID;
  // A notification is "unread" if the created_at time is null, so set that to the current time
  // to "view" whatever this notification is.
  const now = moment();
  const actionType = req.body.actionType;
  const message = req.body.message;
  if (actionType === 'friend') {
    // A friend_request defaults "answered" and "accepted" to false. If a user answered a
    // request but didn't accept the loan then threat it as if the user blocked the other
    // user. If both a true a new friend relationship is added to the "friend" table so
    // the row in this table is essentially ignored.
    const friendAlertText = `The user with the user name "${otherUsersUserName}" wants to be your friend and said: "${message}"`;
    const friendRequestQueryText = 'INSERT INTO "friend_request" ("from_user_id", "to_user_id", "message") VALUES ($1, $2, $3) returning "request_id";';
    pool.query(friendRequestQueryText, [userID, otherUserID, message])
      .then(friendRequestQueryResponse => {
        // A friend request was submitted so make a new notification for the other user
        // so they can actually respond to it.
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
    const borrowGameQueryText = 'INSERT INTO "loaned_game" ("game_id", "owner_id", "friend_id", "loan_start", "loan_end") VALUES ($1, $2, $3, $4, $5) returning "loan_id";';
    pool.query(borrowGameQueryText, [gameID, otherUserID, userID, startDate, endDate])
      .then(loanRequestQueryResponse => {
        // A loan request was submitted so make a new notification for the other user
        // so they can actually respond to it.
        const loanQueryText = 'INSERT INTO "alert" ("user_id", "created_at", "alert_text", "loaned_game_id") VALUES ($1, $2, $3, $4);';
        const loanAlertText = `Your friend with the user name "${otherUsersUserName}" wants to borrow your game: "${gameTitle}" from ${startDate.format('MM/DD')}-${endDate.format('MM/DD')} and said "${message}"`;
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
// Update the status of a game loan to either accept or decline.
router.post('/update-borrow-game-request', rejectUnauthenticated, (req, res) => {
  const viewedAt = moment();
  const alertID = req.body.alertID;
  const agreed = req.body.agreed;
  const userID = req.user.user_id;
  const loanedGameID = req.body.loanedGameID;
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

// TODO only allow a notification to be created for the signed in user.
// Update the status of a friend request to either block or accept.
router.post('/update-friend-request', rejectUnauthenticated, (req, res) => {
  const viewedAt = moment();
  const alertID = req.body.alertID;
  const agreed = req.body.agreed;
  const userID = req.user.user_id;
  const friendRequestID = req.body.friendRequestID;
  const updateAlertText = 'UPDATE "alert" SET "viewed_at" = $1 WHERE alert_id = $2 AND user_id = $3;';
  const updateFriendRequestText = 'UPDATE "friend_request" SET "answered" = TRUE, "accepted" = $1 WHERE "request_id" = $2 AND to_user_id = $3 returning from_user_id;';
  const addFriendRelationText = 'INSERT INTO "friend" ("user_id", "friend_id") VALUES ($1, $2);';
  pool.query(updateAlertText, [viewedAt, alertID, userID])
    // Set this alert to viewed.
    .then(() =>
      pool.query(updateFriendRequestText, [agreed, friendRequestID, userID])
        // Set the friend request to viewed and either accept or decline the request.
        .then(friendID =>
          // If the user agreed to the friend request insert a new friend relationship into
          // the "friends" table.
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

// // TODO only allow a notification to be created for the signed in user.
// // Update the status of a friend request to either block or accept.
// router.post('/update-friend-request', rejectUnauthenticated, (req, res) => {
//   const viewedAt = moment();
//   const alertID = req.body.alertID;
//   const agreed = req.body.agreed;
//   const userID = req.user.user_id;
//   const friendRequestID = req.body.friendRequestID;
//   const updateAlertText = 'UPDATE "alert" SET "viewed_at" = $1 WHERE alert_id = $2 AND user_id = $3;';
//   const updateFriendRequestText = 'UPDATE "friend_request" SET "answered" = TRUE, "accepted" = $1 WHERE "request_id" = $2 AND to_user_id = $3 returning from_user_id;';
//   const addFriendRelationText = 'INSERT INTO "friend" ("user_id", "friend_id") VALUES ($1, $2);';
//   const friendRequestNotification = 'INSERT INTO "alert" ("user_id", "created_at", "alert_text", "friend_request_id") VALUES ($1, $2, $3, $4);';
//   const accepted = agreed ? 'accepted' : 'declined';
//   const friendRequestAlertText = `The user "placeholder" ${accepted} your friend request.`;
//   pool.query(updateAlertText, [viewedAt, alertID, userID])
//     // Set this alert to viewed.
//     .then(() =>
//       pool.query(updateFriendRequestText, [agreed, friendRequestID, userID])
//         // Set the friend request to viewed and either accept or decline the request.
//         .then(friendID =>
//           // If the user agreed to the friend request insert a new friend relationship into
//           // the "friends" table.
//           pool.query(friendRequestNotification, [userID, viewedAt, friendRequestAlertText, friendRequestID])
//             // Set the friend request to viewed and either accept or decline the request.
//             .then(() =>
//               agreed && pool.query(addFriendRelationText, [friendID.rows[0].from_user_id, userID])
//                 .then(updateResponse =>
//                   res.send(updateResponse)
//                 ))
//         ))
//     .catch((error) => {
//       console.log(error);
//       res.sendStatus(500);
//     });
// });

// var title;
// var headline;

// // Use a function to get this value so it can be used other palces as well?
// router.get('/test/code/:code', function (req, res, next) {
//   var procedure = "EXECUTE procedureName 999, 'userName', " + req.params.code
//   callFunc(procedure, function (title, headline) {

//     res.render('display', {
//       title: title,
//       description: headline,
//       var1: 'block sidebar',
//       var2: 'block content',
//       image: 'http://baidun.com/wp-content/uploads/2013/06/SI_RM_1070bw-900x598.jpg',
//       url: 'https://www.youtube.com/watch?v=ZB_VPDXAhKU'

//     })
//   })
// })


// function callFunc(procedure, cb) {
//   request.get('http://myWebservice.com/myService.asmx/myServiceDB?callback=&userName=username&procedureName=' + procedure, function (req, res, body) {

//     var testValue = body.slice(1, -2);
//     var result1 = JSON.parse(testValue);
//     var result2 = JSON.parse(result1);
//     title = result2.jobSelect[0].jobTitle;
//     headline = decodeURI(result2.jobSelect[0].jobHeadline);
//     cb(title, headline);
//   })
// }

module.exports = router;
