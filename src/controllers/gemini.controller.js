
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

    res.status(200).json(new ApiResponse(200, data));
  } catch (error) {
    const err = error.response?.data || error.message;
    console.error("❌ Gemini API Error:", err);
    res.status(500).json({ error: err });
  }
});

export { questionSubmissionAiChat };
