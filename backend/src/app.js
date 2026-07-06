const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Production-ready explicit CORS setup
app.use(
  cors({
    origin: [
      "https://interview-trainer-agent-one.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Relaxed Rate Limiter for testing and live evaluation sessions
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Increased from 50 to 150 so you don't get locked out during demonstrations
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Server Health Verification Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Primary Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

// Fallback safety route handler to capture accidental /api/api path duplications gracefully
app.use("/api/api/auth", authRoutes);
app.use("/api/api/interview", interviewRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;