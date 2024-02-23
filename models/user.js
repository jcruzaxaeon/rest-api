
/* 

models/user.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

'use strict';

const { Model, DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
   class User extends Model { };

   // Initialize Models
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

   // Define Associations
   User.associate = (models) => {
      User.hasMany(models.Course, {
         as: 'student', // alias
         foreignKey: {
            fieldName: 'userId',
            allowNull: false,
         },
      });
   };

   return User;
};