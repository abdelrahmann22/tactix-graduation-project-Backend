import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: process.env.LLM_BASE_URL,
});

export async function aiModel(messages) {
  const chatCompletion = await client.chat.completions.create({
    messages,
    model: process.env.LLM_MODEL,
  });

  return chatCompletion.choices[0].message.content;
}

export function buildSystemPrompt(type, context = {}) {
  const base =
    "You are a professional football analyst. Help coaches with match strategy, formations, player roles, and tactical decisions.";

  if (type === "clip") {
    const { event, notes, startTime, endTime, matchTitle, teamA, teamB } =
      context;
    return (
      base +
      `\n\nYou are analyzing a specific clip from "${matchTitle}" — ${teamA} vs ${teamB}. ` +
      `Clip event: ${event || "unspecified"}. ` +
      `Notes: ${notes || "none"}. ` +
      `Time: ${startTime}-${endTime} seconds. ` +
      `Provide insights about this specific moment in the match.`
    );
  }

  if (type === "board") {
    const { name, fieldType, homeTeam, awayTeam, scenes } = context;
    let prompt =
      base +
      `\n\nYou are analyzing a tactical board "${name}". ` +
      `Field type: ${fieldType}. ` +
      `Home team: ${homeTeam?.name || "unspecified"} (colors: ${homeTeam?.primaryColor || "?"}/${homeTeam?.secondaryColor || "?"}). ` +
      `Away team: ${awayTeam?.name || "unspecified"} (colors: ${awayTeam?.primaryColor || "?"}/${awayTeam?.secondaryColor || "?"}).`;

    if (scenes && scenes.length > 0) {
      prompt += `\nCurrent scenes: ${JSON.stringify(scenes)}`;
    }

    prompt +=
      "\nHelp with tactical improvements, player positioning, and formation suggestions based on the board state.";
    return prompt;
  }

  return base;
}
