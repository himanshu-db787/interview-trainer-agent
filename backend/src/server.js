require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server successfully deployed in production mode on port ${PORT}`);
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