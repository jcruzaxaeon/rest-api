

/*

routes.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

'use strict';

const express = require('express');
const { asyncTryBox } = require('./middleware/async-try-box.js');
const { authenticateUser } = require('./middleware/auth-user.js');
const { User, Course } = require('./models');
const bcrypt = require('bcrypt');

const router = express.Router();
router.use(express.json());

// ## GET, 200 - OK, api/users
// - Return authenticated user's info
router.get('/users', authenticateUser, asyncTryBox(async (req, res) => {
   const user = req.currentUser.dataValues; // .currentUser from authenticateUser
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

// ## GET, 200 - OK, api/courses
// - Return all courses (include course-user)
router.get('/courses', asyncTryBox(async (req, res) => {
   const courses = await Course.findAll({
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
      // attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded'],
      include: [{
         model: User,
         as: 'student',
         attributes: ['firstName', 'lastName', 'emailAddress'],
      },],
   });

   res.json(course); // .json({ 'msg': 'User account created' });
}));

// ## POST, 201 - Created, api/courses
// - Create a new course
router.post('/courses', authenticateUser, asyncTryBox(async (req, res) => {
   const course = req.body;

   await Course.create(course);
   const entry = await Course.findOne({
      where: { 
         title: req.body.title,
         description: req.body.description,
      },
   });
   // console.log('\n', entry.id, '\n');

   // await User.create(req.body);
   res.location(`/courses/${entry.id}`).status(201).send();
}));

// ## PUT, 204 - Updated, api/courses/:id
// - Update an existing course
router.put('/courses/:id', authenticateUser, asyncTryBox(async (req, res) => {
   const course = await Course.findByPk(req.params.id);

   await course.set(req.body).save();

   res.status(204).send();
}));

// ## DELETE, 204 - Deleted, api/courses/:id
// - Delete an existing course
router.delete('/courses/:id', authenticateUser, asyncTryBox(async (req, res) => {
   await Course.destroy({
      where: {id: req.params.id},
   });

   res.status(204).send();
}));

module.exports = router;