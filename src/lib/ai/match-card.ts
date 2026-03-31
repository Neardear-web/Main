/**
 * Generates match card copy for a companion shown to a receiver.
 * Returns copy in both English and Gujarati.
 */
import { haiku, HAIKU } from "./client";

interface ProviderSummary {
  name: string;
  city: string;
  totalSessions: number;
  hardSkills: string[];
  softSkills: string[];
  languages: string[];
  avgFeedbackScore?: number;
}

interface RequestSummary {
  summary: string;       // from extractRequest()
  serviceTypes: string[];
}

export interface MatchCardCopy {
  en: string;
  gu: string;
}

export async function generateMatchCard(
  provider: ProviderSummary,
  request: RequestSummary
): Promise<MatchCardCopy> {
  const response = await haiku.create({
    model: HAIKU,
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Generate a short, warm match card description for a companion on the NearDear platform.

Companion details:
- Name: ${provider.name}
- City: ${provider.city}
- Sessions completed: ${provider.totalSessions}
- Skills: ${[...provider.hardSkills, ...provider.softSkills].join(", ")}
- Languages: ${provider.languages.join(", ")}
${provider.avgFeedbackScore ? `- Avg feedback score: ${provider.avgFeedbackScore}/5` : ""}

Request context:
- ${request.summary}
- Services: ${request.serviceTypes.join(", ")}

Write 2 sentences maximum. Warm and trustworthy tone. Start with the companion's name. Mention something specific to this match.

Return a valid JSON object with exactly these two keys:
{
  "en": "<English copy here>",
  "gu": "<Gujarati copy in Gujarati script here>"
}

Return ONLY the JSON object. No explanation. No markdown. No code blocks.`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from AI");

  let text = block.text.trim();

  // Strip markdown code fences if present
  text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  // Extract JSON object if wrapped in extra text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON found in AI response: ${text.slice(0, 100)}`);

  return JSON.parse(jsonMatch[0]) as MatchCardCopy;
}
