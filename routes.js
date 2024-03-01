

/*

routes.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

'use strict';

const express = require('express');
const { asyncTryBox } = require('./middleware/async-try-box.js');
const { authenticateUser } = require('./middleware/auth-user.js');
const { User, Course } = require('./models');
const bcrypt = require('bcrypt');

class Report extends Error {
   constructor(message, errs) {
      super(message);
      this.name = this.constructor.name;
      this.errs = errs; // List of errors (array)
      Error.captureStackTrace(this, this.constructor);
   }
}

const router = express.Router();
router.use(express.json());

// ## GET, 200 - OK, api/users
// - Return authenticated user's info
router.get('/users', authenticateUser, asyncTryBox(async (req, res) => {
   const user = req.currentUser.dataValues; // .currentUser from authenticateUser
   const data = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
   };
   res.json(data);
}));

// ## POST, 201 - Created, api/users
// - Create a new user entry
router.post('/users', asyncTryBox(async (req, res) => {
   const user = req.body;

   // Validations
   const errMsgs = [];

   if (!user) errMsgs.push('Missing: Body Payload')
   if (!user.firstName) errMsgs.push('Missing: First Name');
   if (!user.lastName) errMsgs.push('Missing: Last Name');
   if (!user.emailAddress) errMsgs.push('Missing: Email Address');
   if (!user.password) errMsgs.push('Missing: Password');
   if (errMsgs.length > 0) {
      const report = new Report('Invalid User-Data', errMsgs);
      report.status = 400;
      throw report;
   }

   req.body.password = bcrypt.hashSync(user.password, 10);

   await User.create(req.body);
   res.location('/').status(201).send(); // .json({ 'msg': 'User account created' });
}));

// ## GET, 200 - OK, api/courses
// - Return all courses (include course-user)
router.get('/courses', asyncTryBox(async (req, res) => {
   const courses = await Course.findAll({
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [{
         model: User,
         as: 'student',
         attributes: ['firstName', 'lastName', 'emailAddress'],
      },],
   });

   res.json(courses); // .json({ 'msg': 'User account created' });
}));

// ## GET, 200 - OK, api/courses/:id
// - Return a single-course per `:id` (include course-user)
router.get('/courses/:id', asyncTryBox(async (req, res) => {
   const id = req.params.id;
   const course = await Course.findByPk(id, {
      attributes: ['id', 'title', 'description', 'estimatedTime', 'materialsNeeded', 'userId'],
      include: [{
         model: User,
         as: 'student',
         attributes: ['firstName', 'lastName', 'emailAddress'],
      },],
   });

   res.json(course);
}));

// ## POST, 201 - Created, api/courses
// - Create a new course
router.post('/courses', authenticateUser, asyncTryBox(async (req, res) => {
   const course = req.body;

   // Validations
   const errMsgs = [];

   if (!course) errMsgs.push('Missing: Course Information.');
   if (!course.title) errMsgs.push('Missing: Course Title');
   if (!course.description) errMsgs.push('Missing: Description');
   if (errMsgs.length > 0) {
      const report = new Report('Invalid Course-Data', errMsgs);
      report.status = 400;
      throw report;
   }

   const entry = await Course.create(course);

   res.location(`/courses/${entry.id}`).status(201).send();
}));

// ## api/courses/:id
// - PUT, 204 - Updated, 
// - Update an existing course
router.put('/courses/:id', authenticateUser, asyncTryBox(async (req, res) => {
   let course = req.body;
   const user = req.currentUser.dataValues;

   // Validations
   const errMsgs = [];
   const report = new Report('', errMsgs);

   if (!course) errMsgs.push('Missing: Course Information.');
   if (!course.title) errMsgs.push('Missing: Course Title');
   if (!course.description) errMsgs.push('Missing: Description');

   course = await Course.findByPk(req.params.id);
   if (!course) errMsgs.push('Course ID not found.');
   if (errMsgs.length > 0) {
      report.message = 'Invalid Course-Data';
      report.status = 400;
      throw report;
   }

   const forbidden = user.id !== course.userId;
   if (forbidden) {
      errMsgs.push('Insufficient Permissions');
      report.message = 'Access Denied';
      report.status = 403;
      throw report;
   }

   await course.set(req.body).save();

   res.status(204).send();
}));

// ## DELETE COURSE
// - 204 - Deleted, api/courses/:id
// - Delete an existing course
router.delete('/courses/:id', authenticateUser, asyncTryBox(async (req, res) => {
   const user = req.currentUser.dataValues;

   // Validations
   const errMsgs = [];
   const report = new Report('', errMsgs);

   const course = await Course.findByPk(req.params.id);
   if (!course) errMsgs.push('Course ID Not Found.');
   if (errMsgs.length > 0) {
      report.message = 'Invalid Course ID';
      report.status = 400;
      throw report;
   }

   const forbidden = user.id !== course.userId;
   if (forbidden) {
      errMsgs.push('Insufficient Permissions');
      report.message = 'Access Denied';
      report.status = 403;
      throw report;
   }

   await Course.destroy({ where: { id: req.params.id } });
   res.status(204).send();
}));

module.exports = router;