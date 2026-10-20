const { database } = require("../database");

const getStudents = (req, res) => {
  const getStudentsQuery = `SELECT * FROM STUDENTS`;

  database.execute(getStudentsQuery, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.send(result);
  });
};

const addStudent = (req, res) => {
  const { name, email, age } = req.body;

  const addStudentQuery = `INSERT INTO STUDENTS (name, email, age) VALUES (?, ?, ?)`;

  database.execute(addStudentQuery, [name, email, age], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.send("Student Added Successfully");
  });
};

const getStudentById = (req, res) => {
  const { id } = req.params;

  const getStudentQuery = `SELECT * FROM STUDENTS WHERE id = ?`;

  database.execute(getStudentQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.send(result);
  });
};

const updateStudentById = (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;

  const updateStudentQuery = `UPDATE STUDENTS SET name = ? , age = ? WHERE id = ?`;

  database.execute(updateStudentQuery, [name, age, id], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send("Student Updated Successfully");
  });
};

const deleteStudentById = (req, res) => {
  const { id } = req.params;

  const deleteStudentQuery = `DELETE FROM STUDENTS WHERE id = ?`;

  database.execute(deleteStudentQuery, [id], (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    res.send(`Student with id:${id} deleted successfully`);
  });
};

module.exports = {
  getStudents,
  addStudent,
  getStudentById,
  updateStudentById,
  deleteStudentById,
};
