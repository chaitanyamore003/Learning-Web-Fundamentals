import "dotenv/config";

import express from "express";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//models
import User from "./models/user.model.js";

// Health check API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Said Hi API!",
  });
});

export default app;
