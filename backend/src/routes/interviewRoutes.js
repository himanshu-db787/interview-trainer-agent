const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  generateInterview,
  getHistory,
  getSessionById,
} = require("../controllers/interviewController");

const router = express.Router();

router.post(
  "/generate",
  protect,
  [
    body("jobTitle").trim().notEmpty().withMessage("Job title is required"),
    body("experienceLevel")
      .isIn(["fresher", "junior", "mid", "senior"])
      .withMessage("Experience level must be fresher, junior, mid, or senior"),
    body("resumeSnippet").optional().isString(),
  ],
  generateInterview
);

router.get("/history", protect, getHistory);
router.get("/:id", protect, getSessionById);

module.exports = router;