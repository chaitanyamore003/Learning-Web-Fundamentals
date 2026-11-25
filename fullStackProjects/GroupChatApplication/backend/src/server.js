import "dotenv/config";
import http from "http";
import cron from "node-cron";
import app from "./app.js";
import db from "./config/database.js";
import { setupSocketServer } from "./config/socket.js";
import { setupSockets } from "./sockets/index.js";
import { archiveOldMessages } from "./modules/services/archive.service.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Sync database
    await db.sync();
    console.log("Database synced successfully.");

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = setupSocketServer(server);

    // Make Socket.IO accessible inside controllers
    app.set("io", io);

    // Register socket authentication and event handlers
    setupSockets(io);

    // Start server
    server.listen(PORT, () => {
      console.log(`Said Hi server running on port ${PORT}`);
    });

    // ==========================================
    // 🕒 CRON JOB: Nightly Message Archiving
    // ==========================================
    // Runs every day at 2:00 AM (Server local time)
    cron.schedule("0 2 * * *", async () => {
      console.log("⏰ Cron job triggered: Nightly Archive");
      try {
        await archiveOldMessages();
      } catch (error) {
        console.error("❌ Nightly archive cron job failed:", error);
      }
    });

    console.log("✅ Nightly archive cron job scheduled for 2:00 AM.");
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
