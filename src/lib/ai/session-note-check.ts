/**
 * Checks session note quality before it is sent to the family.
 * Flags notes that are too brief, vague, or raise a welfare concern.
 */
import { haiku, HAIKU } from "./client";

export interface SessionNoteCheckResult {
  isAdequate: boolean;
  qualityScore: number;        // 1–10
  hasConcern: boolean;         // true if note hints at a welfare issue
  concernSummary: string | null;
  feedback: string;            // shown to companion if note is inadequate
}

export async function checkSessionNote(
  note: string,
  durationMinutes?: number
): Promise<SessionNoteCheckResult> {
  const response = await haiku.create({
    model: HAIKU,
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are reviewing a session note written by a companion on the NearDear platform. The note will be shared with the elder's family.

${durationMinutes ? `Session duration: ${durationMinutes} minutes` : ""}

Session note:
"${note}"

Evaluate:
1. Is it adequate? (specific, informative, reassuring for the family)
2. Quality score 1–10
3. Does it hint at any welfare concern? (health issue, safety, distress)
4. If inadequate, what feedback should the companion receive?

Return a valid JSON object:
{
  "isAdequate": <true if score >= 6>,
  "qualityScore": <1-10>,
  "hasConcern": <true/false>,
  "concernSummary": "<brief summary or null>",
  "feedback": "<polite guidance for the companion, in second person>"
}

Return ONLY the JSON. No explanation.`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response from AI");

  return JSON.parse(block.text.trim()) as SessionNoteCheckResult;
}
