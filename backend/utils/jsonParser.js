import AppError from './appError.js';

/**
 * Robustly extracts and parses JSON from raw LLM text.
 * Handles markdown code blocks, leading/trailing whitespace, and conversational chatter.
 * 
 * @param {string} rawText - Raw output from the LLM
 * @returns {object} Parsed JSON object
 */
export const extractAndParseJSON = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    throw new AppError('Received empty or invalid response content from AI model.', 502);
  }

  let cleanedText = rawText.trim();

  // 1. Try to extract content inside ```json ... ``` or ``` ... ``` block
  const markdownCodeBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = cleanedText.match(markdownCodeBlockRegex);
  if (match && match[1]) {
    cleanedText = match[1].trim();
  }

  // 2. If it still doesn't look like JSON (doesn't start with { and end with }),
  // attempt to locate the first '{' and the last '}'
  if (!cleanedText.startsWith('{') || !cleanedText.endsWith('}')) {
    const firstBraceIndex = cleanedText.indexOf('{');
    const lastBraceIndex = cleanedText.lastIndexOf('}');
    
    if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
      cleanedText = cleanedText.substring(firstBraceIndex, lastBraceIndex + 1).trim();
    }
  }

  // 3. Attempt JSON parse
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('[JSON Parser Error] Failed to parse extracted content. Raw text was:', rawText);
    throw new AppError(
      `AI model output could not be parsed as JSON. Parse error: ${error.message}`,
      502
    );
  }
};
