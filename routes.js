

/*

routes.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

'use strict';

const express = require('express');
const { asyncTryBox } = require('./middleware/async-try-box.js');
const { authenticateUser } = require('./middleware/auth-user.js');
const { User } = require('./models');
const bcrypt = require('bcrypt');

const router = express.Router();
router.use(express.json());

// ## GET, 200 - OK, api/users
// - Return authenticated user's info
router.get('/users', authenticateUser, asyncTryBox(async (req, res) => {
   const user = req.currentUser.dataValues;
   const data = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddress,
   };
   res.json(req.currentUser);
   console.log(data);
}));

// ## POST, 201 - Created, api/users
// - Create a new user entry
router.post('/users', asyncTryBox(async (req, res) => {
   try {
      const user = req.body;
      req.body.password = bcrypt.hashSync(user.password, 10);

      // [!TODO] Password validation here? & on DB?

      await User.create(req.body);
      res.location('/').status(201).send(); // .json({ 'msg': 'User account created' });
   } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
         const errors = error.errors.map(err => err.message);
         res.status(400).json({ errors });
      } else { throw error; }
   }
}));

module.exports = router;