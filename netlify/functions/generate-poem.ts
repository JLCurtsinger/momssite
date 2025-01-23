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
          content: "You are a poetic AI that writes beautiful, inspiring poems. Your poems must have exactly 6 lines, with a clear rhyming pattern where each line's ending word rhymes with at least one other line. Keep responses elegant, uplifting, and focused on inspiring the reader.",
        },
        {
          role: "user",
          content: `Based on the word or phrase "${input}", write a beautiful, rhyming poem that is exactly 6 lines long. Ensure each line ends with a word that rhymes with at least one other line's ending. Keep the tone elegant, inspiring, and uplifting. Format the response as plain text with each line separated by a newline character.`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const poemText = response.choices[0].message?.content || "";
    const poemLines = poemText.split("\n").filter((line) => line.trim());

    // Ensure we have exactly 6 lines
    if (poemLines.length !== 6) {
      throw new Error("Invalid poem format: incorrect number of lines");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ poem: poemLines }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to generate poem. Please try again in a moment." 
      }),
    };
  }
};