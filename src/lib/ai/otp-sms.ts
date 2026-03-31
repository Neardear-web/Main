/**
 * Generates personalised OTP SMS copy in the user's preferred language.
 * Keep messages under 160 characters (1 SMS unit).
 */
import type { AppLanguage } from "@/lib/translate";

interface OtpSmsParams {
  name: string;
  otp: string;
  lang: AppLanguage;
  expiryMinutes?: number;
}

const TEMPLATES: Record<AppLanguage, (p: OtpSmsParams) => string> = {
  EN: ({ name, otp, expiryMinutes = 10 }) =>
    `Hi ${name}, your NearDear OTP is ${otp}. Valid for ${expiryMinutes} mins. Do not share with anyone.`,

  GU: ({ name, otp, expiryMinutes = 10 }) =>
    `નમસ્તે ${name}, તમારો નિયરડિયર OTP ${otp} છે. ${expiryMinutes} મિનિટ માટે માન્ય. કોઈ સાથે શેર કરશો નહીં.`,
};

export function buildOtpSms(params: OtpSmsParams): string {
  const template = TEMPLATES[params.lang] ?? TEMPLATES.EN;
  const message = template(params);

  // Warn during development if over 160 chars
  if (process.env.NODE_ENV !== "production" && message.length > 160) {
    console.warn(`OTP SMS exceeds 160 chars (${message.length}): ${message}`);
  }

  return message;
}
