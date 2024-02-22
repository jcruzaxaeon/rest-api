

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

### Setup `Sequelize`
1. Install
   ```s
   #Sequelize, Sequelize CLI 
   $ npm i sequelize sqlite3
   $ npm i sequelize-cli
   $ npx sequelize init  #Initialize project DB
   ```
1. Update Configuration
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