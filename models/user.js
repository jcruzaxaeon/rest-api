
/* 

models/user.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
   class User extends Model { };

   User.init(
      { // Attributes
         firstName: {
            type: DataTypes.STRING,
         },
         lastName: {
            type: DataTypes.STRING,
         },
         emailAddress: {
            type: DataTypes.STRING,
         },
         password: {
            type: DataTypes.STRING,
         },
      },
      
      { // Options
         sequelize,
      }
   );

   return User;
};