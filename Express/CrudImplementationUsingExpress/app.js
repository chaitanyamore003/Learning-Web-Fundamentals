const express = require("express");
const app = express();
const studentRouter = require("./student.routes");
const courseRouter = require("./course.routes");

app.get("/", (req, res) => {
  res.send(`<h1>Welcome to the Student & Course Portal API!</h1><hr>
            <h3>use below links for navigation</h3>
            <a href="/students">Get Students List</a><br>
            <a href="/courses">Get Courses List</a>`);
});

app.use("/students", studentRouter);
app.use("/courses", courseRouter);

//to handle 404
app.use((req, res) => {
  res.status(404).send("<h1>Error 404 Page not Found</h1>");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000, http://localhost:3000");
});
