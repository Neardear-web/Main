import Anthropic from "@anthropic-ai/sdk";

export type AppLanguage = "EN" | "GU";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  EN: "English",
  GU: "Gujarati",
};

/**
 * Translate a single piece of dynamic content.
 * Server-side only — never call from the browser.
 *
 * Returns the original text unchanged if from === to.
 */
export async function translate(
  text: string,
  from: AppLanguage,
  to: AppLanguage
): Promise<string> {
  if (from === to || !text.trim()) return text;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Translate the following ${LANGUAGE_NAMES[from]} text to ${LANGUAGE_NAMES[to]}.

Rules:
- Output ONLY the translated text. No explanation, no quotes, no prefix.
- Preserve line breaks and formatting exactly.
- Keep proper nouns, brand names (NearDear / નિયરડિયર), and numbers unchanged.
- If the text is already in the target language, return it as-is.
- Use natural, conversational tone — not formal or bureaucratic.
- For Gujarati: write in standard Gujarati script, not transliteration.

Text to translate:
${text}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") return text;
  return block.text.trim();
}

/**
 * Translate a batch of strings in a single API call.
 * More efficient than calling translate() in a loop.
 *
 * Returns results in the same order as the input array.
 */
export async function translateBatch(
  texts: string[],
  from: AppLanguage,
  to: AppLanguage
): Promise<string[]> {
  if (from === to) return texts;

  const numbered = texts
    .map((t, i) => `[${i + 1}] ${t}`)
    .join("\n---\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Translate each numbered item from ${LANGUAGE_NAMES[from]} to ${LANGUAGE_NAMES[to]}.

Rules:
- Return ONLY the translated items, each prefixed with its original number: [1], [2], etc.
- Separate items with ---
- No explanation, no extra text.
- Use natural, conversational tone.
- Keep proper nouns, brand names (NearDear / નિયરડિયર), and numbers unchanged.
- For Gujarati: write in standard Gujarati script, not transliteration.

Items to translate:
${numbered}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") return texts;

  // Parse [n] result --- [n+1] result
  const results = [...texts]; // fallback to originals
  const parts = block.text.split(/\n?---\n?/);
  for (const part of parts) {
    const match = part.match(/^\[(\d+)\]\s*([\s\S]+)$/);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      if (idx >= 0 && idx < results.length) {
        results[idx] = match[2].trim();
      }
    }
  }
  return results;
}
