const db = require("../utils/db-connection");
const studentModel = require("../models/students");

const addEntry = async (req, res) => {
  try {
    const { name, email } = req.body;
    const student = await studentModel.create({ name: name, email: email });

    res.status(201).send(`User with name: ${name} has been added successfully`);
  } catch (err) {
    res.status(500).send(`Unable to add the student Entry`);
  }

  // const { email, name } = req.body;
  // const insertQuery = `INSERT INTO STUDENTS (email, name) VALUES (?, ?)`;
  // db.execute(insertQuery, [email, name], (err) => {
  //   if (err) {
  //     console.log(err.message);
  //     return res.status(500).send(err.message);
  //   }

  //   console.log("Value has been inserted");
  //   res.status(200).send(`<h1>Student with name: ${name} added successfully`);
  // });
};

const updateEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const student = await studentModel.findByPk(id);
    if (student === null) {
      res.status(404).send(`Student to Update Not Found`);
    }

    //updating student
    student.name = name;
    await student.save();

    res.status(200).send(`Student with id:${id} has been updated`);
  } catch (err) {
    res.status(500).send(`Unable to update the Student entry`);
  }

  // const { id } = req.params;
  // const { name } = req.body;

  // const updateQuery = `Update Students set name = ? where id = ?`;

  // db.execute(updateQuery, [name, id], (err, result) => {
  //   if (err) {
  //     console.log(err.message);
  //     return res.status(500).send(err.message);
  //   }

  //   if (result.affectedRows === 0) {
  //     return res.status(404).send("Student not found");
  //   }

  //   console.log("Value has been updated");
  //   res.send(`Student with id: ${id} has been updated successfully`);
  // });
};

const deleteEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await studentModel.destroy({
      where: {
        id: id,
      },
    });

    if (!deleted) {
      res.status(404).send(`Student to Delete Not Found`);
    } else res.send(`Student with id: ${id} Deleted Successfully`);
  } catch (err) {
    res.status(500).send(`Unable to Delete the Student`);
  }

  // const { id } = req.params;

  // const deleteQuery = `DELETE FROM STUDENTS WHERE id = ?`;

  // db.execute(deleteQuery, [id], (err, result) => {
  //   if (err) {
  //     console.log(err.message);
  //     return res.status(500).send(err.message);
  //   }

  //   if (result.affectedRows === 0) {
  //     return res.status(404).send("Student not found");
  //   }

  //   console.log("Value has been deleted");
  //   res.send(`Student with id: ${id} has been deleted successfully`);
  // });
};

module.exports = {
  addEntry,
  updateEntry,
  deleteEntry,
};
