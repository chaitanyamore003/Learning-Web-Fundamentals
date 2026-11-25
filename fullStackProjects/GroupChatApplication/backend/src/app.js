import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
//models
import "./models/index.js";

//routes
import authRouter from "./modules/routes/auth.routes.js";
import userRouter from "./modules/routes/user.routes.js";
import conversationRouter from "./modules/routes/conversation.routes.js";
import messageRouter from "./modules/routes/message.routes.js";
import mediaRouter from "./modules/routes/media.routes.js";

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
app.use("/api/conversations", conversationRouter);
app.use("/api/messages", mediaRouter);
app.use("/api/messages", messageRouter);

app.use(errorHandler);

export default app;
