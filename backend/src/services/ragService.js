const interviewDataset = require("../config/interviewDataset");

/**
 * Simple, fast keyword matching helper to score text similarity
 */
function calculateSimilarity(str1, str2) {
  const words1 = new Set(str1.toLowerCase().split(/\s+/));
  const words2 = str2.toLowerCase().split(/\s+/);
  let matches = 0;
  
  words2.forEach(word => {
    if (words1.has(word)) matches++;
  });
  
  return matches;
}

/**
 * Retrieves matching benchmark questions based on the target job title
 * @param {string} targetJob - The job title provided by the user
 * @returns {string} - A formatted block of string text containing reference context
 */
function retrieveContext(targetJob) {
  if (!targetJob) return "";

  let bestMatch = null;
  let highestScore = -1;

  // Find the closest dataset entry matching the job title keywords
  interviewDataset.forEach((entry) => {
    const score = calculateSimilarity(entry.jobTitle, targetJob);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  });

  // If we find a baseline match with overlapping keywords, format it as string context
  if (bestMatch && highestScore > 0) {
    return bestMatch.questions.map((q, idx) => `${idx + 1}. ${q}`).join("\n");
  }

  return "";
}

module.exports = { retrieveContext };