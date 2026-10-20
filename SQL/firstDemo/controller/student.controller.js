const db = require("../utils/db-connection");

const addEntry = (req, res) => {
  const { email, name } = req.body;
  const insertQuery = `INSERT INTO STUDENTS (email, name) VALUES (?, ?)`;
  db.execute(insertQuery, [email, name], (err) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }

    console.log("Value has been inserted");
    res.status(200).send(`<h1>Student with name: ${name} added successfully`);
  });
};

const updateEntry = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const updateQuery = `Update Students set name = ? where id = ?`;

  db.execute(updateQuery, [name, id], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Student not found");
    }

    console.log("Value has been updated");
    res.send(`Student with id: ${id} has been updated successfully`);
  });
};

const deleteEntry = (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM STUDENTS WHERE id = ?`;

  db.execute(deleteQuery, [id], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Student not found");
    }

    console.log("Value has been deleted");
    res.send(`Student with id: ${id} has been deleted successfully`);
  });
};

module.exports = {
  addEntry,
  updateEntry,
  deleteEntry,
};
