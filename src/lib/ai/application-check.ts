/**
 * Checks the "why this work" statement on a companion application.
 * Flags red flags and scores genuineness for admin review.
 */
import { haiku, HAIKU } from "./client";

export interface ApplicationCheckResult {
  score: number;               // 1–10. 7+ = genuine, 4–6 = review, <4 = flag
  isGenuine: boolean;          // score >= 7
  redFlags: string[];          // list of concerns, empty if none
  adminNote: string;           // 1-sentence summary for the admin dashboard
}

export async function checkApplicationStatement(
  statement: string
): Promise<ApplicationCheckResult> {
  const response = await haiku.create({
    model: HAIKU,
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are reviewing a companion application for NearDear — a platform that sends companions to care for elders and families in India.

The applicant was asked: "Why do you want to do this work?"

Their answer:
"${statement}"

Assess whether this answer is genuine, motivated, and shows empathy — or is generic, suspicious, or concerning.

Return a valid JSON object:
{
  "score": <1-10>,
  "isGenuine": <true if score >= 7>,
  "redFlags": ["<concern 1>", "<concern 2>"],
  "adminNote": "<one sentence for the admin>"
}

Red flag examples: mentions only money, copy-pasted text, aggressive language, vague to the point of meaningless, concerning attitude toward elders.

Return ONLY the JSON. No explanation.`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response from AI");

  return JSON.parse(block.text.trim()) as ApplicationCheckResult;
}
