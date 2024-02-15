const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "deathnote@37",
  port: 3306,
  database: "github",
});

module.exports = connection;