const express = require("express");

const courseRouter = express.Router();

const courses = [
  { id: 1, name: "Frontend", description: "HTML, CSS, JS, React" },

  { id: 2, name: "Backend", description: "Node.js, Express, MongoDB" },
];

courseRouter.get("/", (req, res) => {
  res.send(`
    <h1>List of all the courses</h1>
    <hr>
    <ul>
      ${courses
        .map(
          (c) =>
            `<li>Course name: ${c.name}, Course description: ${c.description}</li>`,
        )
        .join("")}
    </ul>
  `);
});

courseRouter.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return res.status(404).send("<h1>Course Not Found</h1>");
  }

  res.send(
    `<h1>Course: ${course.name}, Course Description: ${course.description}</h1>`,
  );
});

module.exports = courseRouter;
