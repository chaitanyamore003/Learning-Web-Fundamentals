const express = require("express");

const studentRouter = express.Router();

const students = [
  { id: 1, name: "Alice" },

  { id: 2, name: "Bob" },

  { id: 3, name: "Charlie" },
];

studentRouter.get("/", (req, res) => {
  res.send(`<h1>List of all students</h1><br>
            <ul>
                ${students.map((s) => `<li>${s.name}</li>`).join("")}
            </ul>`);
});

studentRouter.get("/:id", (req, res) => {
  let studentId = req.params.id;
  let student = students.find((s) => s.id == studentId);
  if (!student) {
    return res.status(404).send("Student not found");
  }
  res.send(
    `<h1>The Student with student id ${studentId} is ${student.name}</h1>`,
  );
});

module.exports = studentRouter;
