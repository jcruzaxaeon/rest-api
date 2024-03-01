
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
            allowNull: false,
            validate: {
               notNull: {msg: 'First Name is required.'},
               notEmpty: {msg: 'First Name is required.'},
            },
         },
         lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
               notNull: {msg: 'Last Name is required.'},
               notEmpty: {msg: 'Last Name is required.'},
            },
         },
         emailAddress: {
            type: DataTypes.STRING,
            // allowNull: false,
            unique: {msg: 'Validation error: The email address you entered is already in use. Please try using a different email address.'},
            validate: {
               isEmail: {msg: 'Please enter a valid email address.'},
            },
         },
         password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
               notNull: {msg: 'A password is required.'},
               notEmpty: {msg: 'A password is required.'},
               len: {
                  args: [[8, 20]],
                  msg: 'The password must be between 8-20 characters.',
               },
            },
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