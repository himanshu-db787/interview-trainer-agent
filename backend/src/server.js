require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
}

start();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err.message);
});require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// Render injects its own PORT variable automatically. 0.0.0.0 binding fixes external request blocks.
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server successfully deployed in ${process.env.NODE_ENV || "production"} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database initialization crash:", error.message);
    process.exit(1);
  }
}

start();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err.message);
});