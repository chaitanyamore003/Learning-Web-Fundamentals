//using sequelize for CRUD
const { Op } = require("sequelize");
const busModel = require("../models/buses.model");

const getAvailableBuses = async (req, res) => {
  const { seats } = req.params;

  try {
    const buses = await busModel.findAll({
      where: {
        availableSeats: {
          [Op.gte]: Number(seats),
        },
      },
    });

    if (buses.length === 0) {
      return res
        .status(404)
        .send("NO Buses With Provided Number of Available Seats");
    }

    return res.send(buses);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Unable to fetch Available Buses");
  }
};

const addBus = async (req, res) => {
  const { busNumber, totalSeats, availableSeats } = req.body;

  try {
    const busAdded = await busModel.create({
      busNumber: busNumber,
      totalSeats: totalSeats,
      availableSeats: availableSeats,
    });

    res.send(`Bus with Number: ${busNumber} has been added successfully`);
  } catch (err) {
    return res.status(500).json({
      err: err.message,
    });
  }
};

// const { database } = require("../database");

// const getAvailableBuses = (req, res) => {
//   const { seats } = req.params;

//   const getBusesQuery = `SELECT * FROM BUSES WHERE availableSeats >= ?`;

//   database.execute(getBusesQuery, [seats], (err, result) => {
//     if (err) {
//       return res.status(500).send(err.message);
//     }

//     res.send(result);
//   });
// };

// const addBus = (req, res) => {
//   const { busNumber, totalSeats, availableSeats } = req.body;

//   const addBusQuery = `INSERT INTO BUSES (busNumber, totalSeats, availableSeats) VALUES (?, ?, ?)`;

//   database.execute(
//     addBusQuery,
//     [busNumber, totalSeats, availableSeats],
//     (err) => {
//       if (err) {
//         return res.status(500).send(err.message);
//       }

//       res.send("Bus added Successfully");
//     },
//   );
// };

module.exports = {
  getAvailableBuses,
  addBus,
};
