const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./fatlama.sqlite3', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to SQlite database.');
});

module.exports = db;
