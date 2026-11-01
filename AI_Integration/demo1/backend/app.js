const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).send("Error 404: Not Found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
