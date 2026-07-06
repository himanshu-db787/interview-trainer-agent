function buildInterviewPrompt({ profileName, jobTitle, experienceLevel, resumeSnippet, retrievedContext, numQuestions = 5 }) {
  const contextBlock = retrievedContext
    ? `Relevant reference questions for this role:\n${retrievedContext}\n\n`
    : "";

  const resumeBlock = resumeSnippet
    ? `Candidate's resume/background notes:\n${resumeSnippet}\n\n`
    : "";

  return `You are an expert technical interview coach.
Your job is to prepare the candidate named ${profileName} for a job interview.

Candidate details:
- Name: ${profileName}
- Job title/role: ${jobTitle}
- Experience level: ${experienceLevel}
${resumeBlock}
${contextBlock}

Instructions:
- Generate exactly ${numQuestions} interview questions tailored specifically for ${profileName}.
- Provide a holistic assessment mix: include core technical problems, behavioral scenarios, industry expectations, and HR guidelines.
- For each question, provide a concise model answer (3-5 sentences).
- For each question, provide one specific coaching improvement tip.

Respond ONLY in this exact JSON format, with no extra text before or after:
{
  "questions": [
    {
      "question": "string",
      "modelAnswer": "string",
      "improvementTip": "string"
    }
  ]
}`;
}

module.exports = { buildInterviewPrompt };