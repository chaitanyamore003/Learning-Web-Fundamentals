import app from "./app.js";
import db from "./utils/database.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Said Hi server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
