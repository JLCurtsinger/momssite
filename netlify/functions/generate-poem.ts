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
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a poetic AI that creates beautiful, emotional poems. Keep responses to exactly 4 lines.",
        },
        {
          role: "user",
          content: `Create a beautiful, emotional 4-line poem inspired by the theme of "${input}". Make it personal and inspiring.`,
        },
      ],
    });

    const poemText = response.data.choices[0].message?.content || "";
    const poemLines = poemText.split("\n").filter((line) => line.trim());

    return {
      statusCode: 200,
      body: JSON.stringify({ poem: poemLines }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate poem" }),
    };
  }
};