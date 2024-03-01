
/* 

models/course.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   class Course extends Model { };

   // Initialize Models
   Course.init(
      { // Attributes
         title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
               notNull: {msg: 'Title is required.'},
               notEmpty: {msg: 'Title is required.'},
            },
         },
         description: {
            type: DataTypes.TEXT('medium'),
            allowNull: false,
            validate: {
               notNull: {msg: 'Description is required.'},
               notEmpty: {msg: 'Description is required.'},
            },
         },
         estimatedTime: {
            type: DataTypes.STRING,
         },
         materialsNeeded: {
            type: DataTypes.STRING,
         },
      },

      { // Options
         sequelize,
      }
   );

   // Define Associations
   Course.associate = (models) => {
      Course.belongsTo(models.User, {
         as: 'student', // alias
         foreignKey: {
            fieldName: 'userId',
            allowNull: false,
         },
      });
   };

   return Course;
};