const { Sequelize } = require("sequelize");

const database = new Sequelize("testdb", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

//testing the connection using IFFE Function
(async () => {
  try {
    await database.authenticate();
    console.log("Database connection successful");
  } catch (err) {
    console.log(err);
  }
})();

module.exports = database;

// require("dotenv").config();
// const mysql = require("mysql2");

// const database = mysql.createConnection({
//   host: "localhost",
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// //creating tables

// //user table
// const userTableCreationQuery = `CREATE TABLE IF NOT EXISTS Users(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(20),
//     email VARCHAR(20)
// )`;

// //buses table
// const busesTableCreationQuery = `CREATE TABLE IF NOT EXISTS Buses(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     busNumber INT,
//     totalSeats INT,
//     availableSeats INT
// )`;

// //bookings table
// const bookingsTableCreationQuery = `CREATE TABLE IF NOT EXISTS Bookings(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     seatNumber INT
// )`;

// //payments table
// const paymentsTableCreationQuery = `CREATE TABLE IF NOT EXISTS Payments(
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     amountPaid INT,
//     paymentStatus BOOLEAN
// )`;

// //executing the queries

// const queries = [
//   userTableCreationQuery,
//   busesTableCreationQuery,
//   bookingsTableCreationQuery,
//   paymentsTableCreationQuery,
// ];

// // Replace your database.connect() block with this:
// const initializeDatabase = (callback) => {
//   database.connect((err) => {
//     if (err) return callback(err);

//     let completed = 0;

//     queries.forEach((query) => {
//       database.query(query, (err) => {
//         if (err) return callback(err);

//         completed++;

//         if (completed === queries.length) {
//           callback(null);
//         }
//       });
//     });
//   });
// };

// module.exports = {
//   database,
//   initializeDatabase,
// };
