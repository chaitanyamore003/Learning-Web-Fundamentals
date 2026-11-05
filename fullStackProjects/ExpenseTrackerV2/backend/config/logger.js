// Import winston
const winston = require("winston");
const path = require("path");

// Configure logger
const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),

  transports: [
    // Store error logs separately
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),

    // Store all logs
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
    }),

    // Display logs in terminal
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

module.exports = logger;
