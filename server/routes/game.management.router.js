const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

const router = express.Router();

router.delete('/game', rejectUnauthenticated, (req, res) => {
  const userID = req.params.userID;
  const gameID = req.params.gameID;
  const queryText = 'DELETE FROM "user_owned_game" WHERE "user_owned_game".game_id = $1 AND "user_owned_game".user_id = $2';
  pool.query(queryText, [gameID, userID])
    .then(res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// router.post('/game', rejectUnauthenticated, (req, res) => {
//   const userID = req.params.userID;
//   const gameID = req.params.gameID;
//   const queryText = 'INSERT';
//   pool.query(queryText, [gameID, userID])
//     .then(res.sendStatus(204))
//     .catch((error) => {
//       console.log(error);
//       res.sendStatus(500);
//     });
// });

// router.post('/database/game', rejectUnauthenticated, (req, res) => {
//   const userID = req.params.userID;
//   const gameID = req.params.gameID;
//   const queryText = '';
//   pool.query(queryText, [gameID, userID])
//     .then(res.sendStatus(204))
//     .catch((error) => {
//       console.log(error);
//       res.sendStatus(500);
//     });
// });

router.get('/all-database-games', (req, res) => {
  const queryText = 'SELECT "bgg_game_id" FROM "game";';
  pool.query(queryText)
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

module.exports = router;
