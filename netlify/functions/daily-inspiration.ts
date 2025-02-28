
import { Handler } from "@netlify/functions";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { input } = JSON.parse(event.body || "{}");

    if (!input) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Input is required" }),
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a poetic AI that writes warm, uplifting, and inspiring poems. Your style is heartfelt and encouraging, similar to morning affirmations or gentle words of wisdom shared with a loved one. Your poems should be simple yet meaningful, with a smooth and natural flow. The tone should feel personal, like a message of kindness and positivity sent to brighten someone's day.",
        },
        {
          role: "user",
          content: `Write today's inspirational poem. The poem should be exactly 6 lines long and follow a natural rhyming pattern (AABB, AABCCB, or soft rhyming if needed). Use warm and welcoming imagery, evoking themes of light, new beginnings, and encouragement. The poem should feel personal, as if written for a loved one to start their day with hope and motivation. Keep the style simple, heartfelt, and clear, avoiding overly complex metaphors. Format the response as plain text with each line separated by a newline character.`,
        },
      ],
      max_tokens: 120,
      temperature: 0.6,
    });

    const poemText = response.choices[0].message?.content || "";
    const poemLines = poemText.split("\n").filter((line) => line.trim());

    // Ensure we have exactly 6 lines
    if (poemLines.length !== 6) {
      throw new Error("Invalid poem format: incorrect number of lines");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400" // Cache for one day
      },
      body: JSON.stringify({ poem: poemLines }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to generate daily inspiration. Please try again in a moment." 
      }),
    };
  }
};
