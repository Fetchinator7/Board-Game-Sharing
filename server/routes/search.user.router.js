const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/username/:search', (req, res) => {
  const search = req.params.search;
  console.log('search for username:', search);
  pool.query('SELECT user_name FROM users WHERE user_name ILIKE $1', [`%${search}%`])
    .then(results => {
      console.log('users', results.rows);
      res.send(results.rows);
    })
    .catch(error => {
      console.log('Error making SELECT for user_name:', error);
      res.sendStatus(500);
    });
});

module.exports = router;
