const express = require('express');
const pool = require('../modules/pool');
const axios = require('axios');
const convert = require('xml-js');

const router = express.Router();

router.get('/keyword/:search', (req, res) => {
  const search = req.params.search;
  axios.get(`http://boardgamegeek.com/xmlapi2/search?query=${search}`)
    .then((response) => {
      const data = JSON.parse(
        convert.xml2json(response.data, { compact: true, spaces: 2 })
      );
      const games = data.items;
      // If no search results were returned send 404.
      if (games.item) {
        res.send(games.item);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

router.get('/game-id/:id', (req, res) => {
  const search = req.params.id;
  axios.get(`http://boardgamegeek.com/xmlapi2/thing?id=${search}`)
    .then((response) => {
      const data = JSON.parse(
        convert.xml2json(response.data, { compact: true, spaces: 2 })
      );
      const games = data.items;
      // If no search results were returned send 404.
      if (games.item) {
        res.send(games.item);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
});

module.exports = router;
