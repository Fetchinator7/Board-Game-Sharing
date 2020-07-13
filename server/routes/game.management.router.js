const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

const router = express.Router();

router.put('/game', rejectUnauthenticated, (req, res) => {
  const userID = req.user.user_id;
  const gameID = req.body.gameID;
  const queryText = 'DELETE FROM "user_owned_game" WHERE "user_owned_game".game_id = $1 AND "user_owned_game".user_id = $2';
  pool.query(queryText, [gameID, userID])
    .then(res.sendStatus(204))
    .catch((error) => {
      console.log(error);
      res.sendStatus(500);
    });
});

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

router.post('/database/game', rejectUnauthenticated, (req, res) => {
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
