import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

export async function aiModel(prompt) {
  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a football tactics assistant. Help coaches analyze formations, player roles, and match strategies.",
      },
      { role: "user", content: prompt },
    ],
    model: process.env.LLM_MODEL,
  });

  return chatCompletion.choices[0].message.content;
}
