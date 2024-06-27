import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(req) {
  console.log("Received request in /api/chat");
  try {
    const { prompt } = await req.json();
    console.log("Prompt received:", prompt);

    // Check if the API key is set
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set in the environment variables");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log("Sending request to Gemini API");
    const result = await model.generateContent(
      prompt + " Please format your response in bullet points."
    );
    console.log("Received result from Gemini API");

    const response = await result.response;
    let text = response.text();
    console.log("Raw response from Gemini:", text);

    // Split the text into bullet points
    const bulletPoints = text
      .split("\n")
      .filter(
        (point) => point.trim().startsWith("*") || point.trim().startsWith("-")
      );
    console.log("Formatted bullet points:", bulletPoints);

    return new Response(JSON.stringify({ response: bulletPoints }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return new Response(
      JSON.stringify({
        error:
          error.message || "An error occurred while processing your request.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
