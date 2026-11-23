import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",

  logging: false,

  dialectOptions: {
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
    enableCleartextPlugin: true,
  },

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

(async () => {
  try {
    await db.authenticate();
    console.log("TiDB Cloud Connected Successfully!");
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    throw error;
  }
})();

export default db;
