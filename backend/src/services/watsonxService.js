const fetch = require("node-fetch");

let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const response = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: process.env.WATSONX_API_KEY,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to get IBM IAM token: ${response.status} ${errText}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + data.expires_in * 1000;

  return cachedToken;
}

async function generateWithGranite(prompt, options = {}) {
  const token = await getAccessToken();

  const url = `${process.env.WATSONX_URL}/ml/v1/text/generation?version=2024-05-31`;

  const body = {
    model_id: process.env.WATSONX_MODEL_ID || "ibm/granite-3-8b-instruct",
    input: prompt,
    project_id: process.env.WATSONX_PROJECT_ID,
    parameters: {
      decoding_method: options.decoding_method || "greedy",
      max_new_tokens: options.max_new_tokens || 1200, // Increased to 1200 to ensure full response generation
      min_new_tokens: options.min_new_tokens || 1,
      repetition_penalty: options.repetition_penalty || 1.1,
      temperature: options.temperature ?? 0.7,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`watsonx.ai generation failed: ${response.status} ${errText}`);
  }

  const data = await response.json();
  const generatedText = data?.results?.[0]?.generated_text;

  if (!generatedText) {
    throw new Error("watsonx.ai returned no generated text");
  }

  return generatedText.trim();
}

module.exports = { generateWithGranite };