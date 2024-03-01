

----------------------------------------------------------------------------------------------------
# REST API
- summary: "Team Treehouse Project: Unit 9"
- filename: "readme.md"
- author: {
   - name: "Joel Cruz",
   - email: "jcruz@axaeon.com", }
- project: {
   - name: "REST API",
   - tier: "practice",
   - type: "unit",
   - id: "9t",
   - description: "Project developed independently, for educational purposes, following broad step-by-step specifications provided by Team Treehouse.", }
- org: {
   - name: "Team Treehouse",
   - description: "Online code academy", }
- tools: {
   - Node.js,
   - Express,
	- sequelize,
	- sqlite3, }



----------------------------------------------------------------------------------------------------
## Devlog

### Commit Log
- [x] filter response data: api/courses/:id
- [x] refactor-0
- [x] add advanced validation
- [x] add validation to db models.
- [x] add, test auth middleware. add route: api/users, POST, 201.
- [x] add route: api/courses, GET, 200 (include course-user)
- [x] add, test auth middleware. add route: api/users, POST, 201.
- [x] add route: api/users, GET, 200
- [x] define associations
- [x] initialize models
- [x] test db connection
- [x] run starter project
- [x] update readme
- [x] commit-0



----------------------------------------------------------------------------------------------------
### Initialize Project
```s
$ npm i
$ npm run seed #Run again to re-initialize a DB
$ npm start
```



----------------------------------------------------------------------------------------------------
### Setup `Sequelize`
1. Install
   ```s
   #Sequelize, Sequelize CLI 
   $ npm i sequelize sqlite3
   $ npm i sequelize-cli
   $ npx sequelize init  #Initialize project DB
   ```
1. Update Configuration
   - Add/modify `storage`, `dialect` keys
   - `config.js`:
   ```json
   {
      "development": {
         "storage": "fsjstd-restapi.db",
         "dialect": "sqlite"
      },
   }
   ```
1. Test DB Connection
   ```javascript
   // app.js
   // ..
   const { sequelize } = require('./models');

   // ...
   // ROUTES

   // Set our port.
   app.set('port', process.env.PORT || 5000);

   // Test the database connection.
   (async () => {
      try {
         await sequelize.authenticate();
         console.log('Connection has been established successfully.');
      } catch (error) {
         console.error('Unable to connect to the database:', error);
      }
   })();
   ```



----------------------------------------------------------------------------------------------------
### Dev Notes
- "When defining models for an existing database the model names and attributes need to match the tables in the database exactly otherwise Sequelize will throw an error." -Team Treehouse

#### Define Model (Skeleton)
```javascript
/* 

models/example.js
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/

'use strict';

const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
   class Example extends Model {};
   // Example.init(attibutes, options);
   Example.init({/* Attibutes */}, { sequelize });
   return Example;
};
```

#### Define Model (Basic)
```javascript
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
```



----------------------------------------------------------------------------------------------------
### Define Associations
```javascript

```



----------------------------------------------------------------------------------------------------
1. Define Models
   ```javascript
   import { Sequelize, DataTypes } from 'sequelize';

   const sequelize = new Sequelize('sqlite::memory:');
   const User = sequelize.define('User', {
      username: DataTypes.STRING,
      birthday: DataTypes.DATE,
   });
   ```
1. Persist and Query
   ```javascript
   const jane = await User.create({
      username: 'janedoe',
      birthday: new Date(1980, 6, 20),
   });

   const users = await User.findAll();
   ```