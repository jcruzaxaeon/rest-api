
/* 

models/course.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

'use strict';

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
   class Course extends Model { };

   Course.init(
      { // Attributes
         title: {
            type: DataTypes.STRING,
         },
         description: {
            type: DataTypes.TEXT('medium'),
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

   return Course;
};