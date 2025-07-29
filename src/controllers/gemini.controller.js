import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import Tesseract from "tesseract.js";

  const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const questionSubmissionAiChat = asyncHandler(async (req, res) => {
  const userMessage = req.body.message?.trim();


  if (!userMessage) {
    throw new ApiError(400, "Message is required in the request body");
  }

  try {
    const { data } = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json(new ApiResponse(200, aiReply));
  } catch (error) {
    const err = error.response?.data || error.message;
    console.error("❌ Gemini API Error:", err);
    res.status(500).json({ error: err });
  }
});

const interview = asyncHandler(async (req, res) => {
  const userMessage = req.body.message?.trim();


  if (!userMessage) {
    throw new ApiError(400, "Message is required in the request body");
  }

  // Add your system-style instruction inside the user message
  const fullPrompt = `
You are an AI JavaScript interviewer. 
Format your reply like:
FEEDBACK: <Give constructive feedback on the user's answer>
NEXT_QUESTION: <Ask the next JavaScript interview question>

User's message: ${userMessage}
`;

  try {
    const { data } = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: fullPrompt }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json(new ApiResponse(200, aiReply));
  } catch (error) {
    const err = error.response?.data || error.message;
    console.error("❌ Gemini API Error:", err);
    res.status(500).json({ error: err });
  }
});

const resumeReviewer = asyncHandler(async (req, res) => {
  const resume = req.file;

  if (!resume) {
    throw new ApiError(400, "No image uploaded");
  }

  // Convert image buffer to base64
  const base64Image = req.file.buffer.toString("base64");

  const prompt = `
You are a professional resume reviewer AI.
Please analyze the following resume image and give:
1. Strengths of the resume.
2. Areas of improvement.
3. Suggestions for formatting, clarity, or structure.
Return it in this format:
FEEDBACK:
- Good Points: ...
- Improvements: ...
- Suggestions: ...
`;


  try {
    const { data } = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: req.file.mimetype,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.status(200).json(new ApiResponse(200, aiReply));
  } catch (error) {
    const err = error.response?.data || error.message;

    throw new ApiError(500, "Gemini API Error", err);
  }
});

export { questionSubmissionAiChat, interview, resumeReviewer };
