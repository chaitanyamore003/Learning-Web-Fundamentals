import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import db from "./config/database.js";
import { setupSockets } from "./sockets/index.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.sync();
    console.log("Database synced successfully.");

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
      },
    });

    // Make Socket.IO accessible inside controllers
    app.set("io", io);

    // Initialize socket authentication and event handlers
    setupSockets(io);

    // Start server
    server.listen(PORT, () => {
      console.log(`Said Hi server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
