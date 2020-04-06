var mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Hanzala786",
  database: "todoDb"
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected server! ");
// });

// con.query("CREATE DATABASE todoDb", function(err, result) {
//   if (err) throw err;
//   console.log("Database created");
// });

// var sql =
//   "CREATE TABLE IF NOT EXISTS TodoData (todo_id INT , title VARCHAR(255), data VARCHAR(255))";
// con.query(sql, function(err, result) {
//   if (err) throw err;
//   console.log("Table created");
// });

module.exports = pool.promise();
