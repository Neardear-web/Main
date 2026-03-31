"use client";

import { useLanguage } from "@/lib/language";
import Link from "next/link";

const t = {
  EN: {
    signals: [
      {
        bold: "All companions strictly verified",
        body: "Identity. Character. Ongoing integrity checks.",
      },
      {
        bold: "80% earnings paid directly to every companion",
        body: "Every session. Every time. No exceptions.",
      },
      {
        bold: "Family notified after every visit",
        body: "Check-in. Note. Peace of mind.",
      },
    ],
    cta: "Read how verification works →",
  },
  GU: {
    signals: [
      {
        bold: "બધા સાથીઓ કડક ચકાસણી કરાયેલ",
        body: "ઓળખ. ચારિત્ર્ય. સતત ચકાસણી.",
      },
      {
        bold: "80% કમાણી સીધી દરેક સાથીને",
        body: "દરેક સત્ર. દર વખતે. કોઈ અપવાદ નહીં.",
      },
      {
        bold: "દરેક મુલાકાત પછી પરિવારને જાણ",
        body: "હાજરી. નોંધ. મનની શાંતિ.",
      },
    ],
    cta: "ચકાસણી પ્રક્રિયા વાંચો →",
  },
  HI: {
    signals: [
      {
        bold: "सभी साथी कड़ाई से सत्यापित",
        body: "पहचान। चरित्र। निरंतर सत्यापन।",
      },
      {
        bold: "80% कमाई हर साथी को सीधे",
        body: "हर सत्र। हर बार। कोई अपवाद नहीं।",
      },
      {
        bold: "हर मुलाकात के बाद परिवार को सूचना",
        body: "चेक-इन। नोट। मन की शांति।",
      },
    ],
    cta: "सत्यापन प्रक्रिया पढ़ें →",
  },
};

export default function TrustBar() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <section className="bg-[#1A6B7A] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {copy.signals.map((signal, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-[#E07B2F] text-3xl font-bold mb-3">✓</div>
              <p className="text-white font-semibold text-base mb-1">
                {signal.bold}
              </p>
              <p className="text-white/75 text-sm">{signal.body}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/safety"
            className="text-[#E07B2F] text-sm font-medium hover:opacity-80 transition-opacity"
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
