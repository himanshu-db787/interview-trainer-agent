const { validationResult } = require("express-validator");
const InterviewSession = require("../models/InterviewSession");
const { generateWithGranite } = require("../services/watsonxService");
const { buildInterviewPrompt } = require("../services/promptBuilder");
const { retrieveContext } = require("../services/ragService");
const asyncHandler = require("../utils/asyncHandler");

const generateInterview = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { jobTitle, experienceLevel, resumeSnippet, numQuestions } = req.body;
  const profileName = req.user.name; // Fetched directly via authMiddleware user object
  const retrievedContext = retrieveContext(jobTitle);

  const prompt = buildInterviewPrompt({ 
    profileName,
    jobTitle, 
    experienceLevel, 
    resumeSnippet, 
    retrievedContext,
    numQuestions: parseInt(numQuestions) || 5
  });

  const rawOutput = await generateWithGranite(prompt);

  let parsed;
  try {
    let cleaned = rawOutput.replace(/```json|```/g, "").trim();

    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Standard JSON parse failed. Running clean extraction... Raw text:", rawOutput);
    
    try {
      const questionsArray = [];
      const objectRegex = /\{\s*"question"\s*:\s*"([\s\S]*?)"\s*,\s*"modelAnswer"\s*:\s*"([\s\S]*?)"\s*,\s*"improvementTip"\s*:\s*"([\s\S]*?)"\s*\}/g;
      let match;
      
      while ((match = objectRegex.exec(rawOutput)) !== null) {
        questionsArray.push({
          question: match[1].trim(),
          modelAnswer: match[2].trim(),
          improvementTip: match[3].trim()
        });
      }
      
      if (questionsArray.length > 0) {
        parsed = { questions: questionsArray };
      } else {
        throw new Error("Could not extract any matching QA objects dynamically.");
      }
    } catch (fallbackErr) {
      return res.status(502).json({
        message: "Model response format error. Please try generating again.",
        error: fallbackErr.message
      });
    }
  }

  const qaPairs = parsed.questions.map((q) => ({
    question: q.question,
    modelAnswer: q.modelAnswer || q.answer,
    improvementTips: q.improvementTip || q.improvementTips,
  }));

  const session = await InterviewSession.create({
    user: req.user._id,
    jobTitle,
    experienceLevel,
    resumeSnippet: resumeSnippet || "",
    qaPairs,
  });

  res.status(201).json(session);
});

const getHistory = asyncHandler(async (req, res) => {
  const sessions = await InterviewSession.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.status(200).json(sessions);
});

const getSessionById = asyncHandler(async (req, res) => {
  const session = await InterviewSession.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.status(200).json(session);
});

module.exports = { generateInterview, getHistory, getSessionById };