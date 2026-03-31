/**
 * Scores a companion-request match using Haiku.
 * Called server-side during the matching engine pass.
 */
import { haiku, HAIKU } from "./client";

interface MatchRequest {
  description: string;
  services: string[];
  elderAge?: string;
  isUrgent: boolean;
  isHealthcareRequest?: boolean;
}

interface MatchCompanion {
  occupation: string;
  currentStatus: string;
  ageRange: string;
  hardSkills: string[];
  softSkills: string[];
  sessionsCompleted: number;
  reliabilityScore: number;
}

export interface MatchScore {
  score: number;   // 0–100
  reason: string;  // one sentence for admin / match card
}

export async function scoreCompanionMatch(
  request: MatchRequest,
  companion: MatchCompanion
): Promise<MatchScore> {
  const response = await haiku.create({
    model: HAIKU,
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Score this companion match for NearDear.in

Request: ${JSON.stringify(request)}
Companion: ${JSON.stringify(companion)}

Return ONLY JSON:
{
  "score": <0-100>,
  "reason": "<one sentence why this is a good or poor match>"
}

Consider:
- Occupation relevance to services needed
- Age compatibility with elder if applicable
- Hard skills match to service requirements
- Reliability score (weight heavily for urgent requests)
- Session experience (more sessions = more trust)
- Urgency fit (urgent requests need reliabilityScore >= 90)
${request.isHealthcareRequest ? '\nIMPORTANT: This is an elder healthcare request. Clinical background, personal care experience, and physical care capability are the PRIMARY matching factors — weighted above session count and general availability for this type of request.' : ''}

Return ONLY the JSON. No explanation.`,
      },
    ],
  });

  try {
    const block = response.content[0];
    const text = block.type === "text" ? block.text.trim() : "{}";
    const parsed = JSON.parse(text) as MatchScore;
    // Clamp score to 0-100
    parsed.score = Math.max(0, Math.min(100, parsed.score));
    return parsed;
  } catch {
    return { score: 50, reason: "Standard match" };
  }
}
