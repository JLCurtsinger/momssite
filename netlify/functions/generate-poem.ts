import { Handler } from "@netlify/functions";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

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

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a poetic AI that writes beautiful, inspiring poems. Keep responses elegant, uplifting, and concise—exactly four lines only.",
        },
        {
          role: "user",
          content: `Based on the word or phrase "${input}", write a short, inspirational poem. Keep it elegant, uplifting, and concise—four lines only.`,
        },
      ],
      max_tokens: 60,
      temperature: 0.7,
    });

    const poemText = response.data.choices[0].message?.content || "";
    const poemLines = poemText.split("\n").filter((line) => line.trim());

    // Ensure we only return exactly 4 lines
    if (poemLines.length !== 4) {
      throw new Error("Invalid poem format received");
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