

/*

*/

'use strict';

const express = require('express');
const { asyncTryBox } = require('./middleware/async-try-box.js');
const { User } = require('./models');

const router = express.Router();

// Get all users - GET, 200, api/users
router.get('/users', asyncTryBox( async (req, res) => {
   try {
      const users = await User.findAll();
      res.json(users);
      console.log(users);
   } catch(err) { throw err }
}));

module.exports = router;