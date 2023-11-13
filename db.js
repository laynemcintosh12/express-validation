const { Client } = require('pg');
const { DB_URI } = require('./config');

const db = new Client({
  user: 'laynemcintosh12',
  host: 'localhost',
  database: DB_URI,
  password: 'password', // Make sure the password is a string
  port: 5432, // The default PostgreSQL port
});

db.connect();

module.exports = db;