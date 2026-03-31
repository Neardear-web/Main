import Anthropic from "@anthropic-ai/sdk";

export const haiku = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}).messages;

export const HAIKU = "claude-haiku-4-5-20251001";
