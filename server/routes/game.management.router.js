const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

const router = express.Router();

// This route deletes a user's game with the input id.
router.put('/game', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  const gameID = req.body.gameID;
  const queryText = 'DELETE FROM "user_owned_game" WHERE "user_owned_game".game_id = $1 AND "user_owned_game".user_id = $2';
  // TODO delete any game loans after the user deletes that game.
  // const loanID = Delete from loaned_game returning loaned_game_id
  // For each in the loanID.data.rows.map(gameLoanID =>
  // Delete from alert where loaned_game_id = gameLoanID
  // )
  pool.query(queryText, [gameID, userID])
    .then(res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// A user can add game to their collection by providing the game id.
router.post('/game', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  const gameID = req.body.gameID;
  const queryText = 'INSERT INTO "user_owned_game" ("game_id", "user_id") VALUES ($1, $2)';
  pool.query(queryText, [gameID, userID])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// A user can comment any of their games by submitting the game id and the new comment.
router.post('/comment', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  const gameID = req.body.gameID;
  const comment = req.body.comment;
  const queryText = 'UPDATE user_owned_game SET "comments" = $1 WHERE user_id = $2 AND game_id = $3';
  pool.query(queryText, [comment, userID, gameID])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// Return the database game id based on the Board Game Geek game id.
router.get('/game-table-id/:BGGId', rejectUnauthenticated, (req, res) => {
  const BGGId = req.params.BGGId;
  const queryText = 'SELECT "game_id" FROM "game" WHERE "bgg_game_id" = $1';
  pool.query(queryText, [BGGId])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// Add a new Board Game Geek game to the database by providing the required fileds.
// This only happens i if a game isn't already in the database.
router.post('/database/game', rejectUnauthenticated, (req, res) => {
  // TODO get from bgg directly and add it on the server side.
  const gameID = req.body.bgg_game_id;
  const artwork = req.body.game_img;
  const title = req.body.title;
  const playerRange = req.body.player_range;
  const playTime = req.body.playtime;
  const queryText = 'INSERT INTO "game" ("bgg_game_id", "game_img", "title", "player_range", "playtime") VALUES ($1, $2, $3, $4, $5);';
  pool.query(queryText, [gameID, artwork, title, playerRange, playTime])
    .then(queryResponse => res.send(queryResponse))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

// Return all the games in the database as an array.
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
