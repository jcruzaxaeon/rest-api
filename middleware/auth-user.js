

/*

middleware/auth-user.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

'use strict';

const auth = require('basic-auth'); // $ npm i basic-auth
const bcrypt = require('bcrypt');
const { User } = require('../models');

// Middleware to authenticate a request using "Basic Authorization"
exports.authenticateUser = async (req, res, next) => {
   let msg;

   const credentials = auth(req);

   // Credentials?
   if (credentials) {
      const user = await User.findOne({
         where: { emailAddress: credentials.name },
      });

      // User?
      if (user) {
         const authenticated = bcrypt
            .compareSync(credentials.pass, user.password);

         // Valid Pass?
         if (authenticated) {
            req.currentUser = user;
         } else { msg = 'Authentication failure' }
      } else { msg = 'Username not found' }
   } else { msg = 'Auth header not found' }

   if (msg) {
      console.warn(msg);
      res.status(401).json({ message: 'Access Denied' });
   } else { next(); }
}