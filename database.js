const { Sequelize } = require('sequelize');
const config = require('./config');

const db = new Sequelize(config.database.database, config.database.username, config.database.password, {
  host: config.database.host,
  dialect: config.database.dialect,
});

async function DatabaseConnection(){
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

DatabaseConnection()

module.exports = db;