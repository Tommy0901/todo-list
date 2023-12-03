// *** User Settings *** //

// Please modify "hostname", "user", "password" to match your MySQL server connection settings.
// You can also change the "database" name if it already exists.
// Don't forget to update the same settings in /config/config.json if you make any changes here.
const { development: config } = require("./config/config");

console.log(config);

// *** User Settings End *** //

const mysql = require("mysql2");

// Create connection
const connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL server.");

  // Create database
  connection.query("USE " + config.database, (err, result) => {
    if (err) {
      connection.query(
        `CREATE DATABASE IF NOT EXISTS ${config.database}`,
        (err, result) => {
          if (err) throw err;
          console.log("Database created.");
          process.exit();
        }
      );
    } else {
      console.log("Database already exists.");
      process.exit();
    }
  });
});
