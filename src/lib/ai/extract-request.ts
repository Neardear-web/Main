/**
 * Extracts structured data from a free-text service request.
 * Called server-side when a receiver submits their request description.
 */
import { haiku, HAIKU } from "./client";

export interface ExtractedRequest {
  city: string | null;          // detected city name, null if not mentioned
  serviceTypes: string[];       // list of service slugs from the catalogue
  urgency: "IMMEDIATE_TODAY" | "URGENT_TOMORROW" | "THIS_WEEK" | "SCHEDULED" | "RECURRING";
  forWhom: "SELF" | "PARENT" | "OTHER";
  summary: string;              // 1-sentence clean summary for the match card
}

const SERVICE_SLUGS = [
  "elder-visit", "check-on-parents", "companion-visit",
  "medicine-pickup", "hospital-help", "bank-help",
  "govt-office", "document-help", "property-visit",
  "talk-support", "student-support", "grief-companion",
  "travel-assist", "event-assist",
];

export async function extractRequest(
  description: string
): Promise<ExtractedRequest> {
  const response = await haiku.create({
    model: HAIKU,
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Extract structured information from this service request. The platform is NearDear — a companion service for elders and families in India.

Request text:
"${description}"

Available service slugs: ${SERVICE_SLUGS.join(", ")}

Return a valid JSON object with exactly these fields:
{
  "city": "<city name or null>",
  "serviceTypes": ["<slug>"],
  "urgency": "IMMEDIATE_TODAY" | "URGENT_TOMORROW" | "THIS_WEEK" | "SCHEDULED" | "RECURRING",
  "forWhom": "SELF" | "PARENT" | "OTHER",
  "summary": "<one clear sentence describing the need>"
}

Return ONLY the JSON. No explanation.`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response from AI");

  const parsed = JSON.parse(block.text.trim()) as ExtractedRequest;
  return parsed;
}
