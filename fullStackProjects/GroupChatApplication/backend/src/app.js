import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
//models
import User from "./models/user.model.js";

//routes
import authRouter from "./modules/routes/auth.routes.js";
import userRouter from "./modules/routes/user.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Said Hi API!",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.use(errorHandler);

export default app;
