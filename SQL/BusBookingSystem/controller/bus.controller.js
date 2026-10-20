const { database } = require("../database");

const getAvailableBuses = (req, res) => {
  const { seats } = req.params;

  const getBusesQuery = `SELECT * FROM BUSES WHERE availableSeats >= ?`;

  database.execute(getBusesQuery, [seats], (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.send(result);
  });
};

const addBus = (req, res) => {
  const { busNumber, totalSeats, availableSeats } = req.body;

  const addBusQuery = `INSERT INTO BUSES (busNumber, totalSeats, availableSeats) VALUES (?, ?, ?)`;

  database.execute(
    addBusQuery,
    [busNumber, totalSeats, availableSeats],
    (err) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      res.send("Bus added Successfully");
    },
  );
};

module.exports = {
  getAvailableBuses,
  addBus,
};
