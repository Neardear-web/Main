"use client";

import { useLanguage } from "@/lib/language";
import Link from "next/link";

const earningsRows = [
  { service: "Talk/Support (30 min)", fee: "₹300", earn: "₹240" },
  { service: "Medicine Pickup", fee: "₹400", earn: "₹320" },
  { service: "Bank Work Help", fee: "₹500", earn: "₹400" },
  { service: "Elder Support Visit", fee: "₹700", earn: "₹560" },
  { service: "Hospital Guidance", fee: "₹1,000", earn: "₹800" },
  { service: "Travel Assistance", fee: "₹1,500", earn: "₹1,200" },
];

const trustLadder = [
  { level: "Level 0", label: "Voice Verified", range: "₹3,000–6,000/month" },
  { level: "Level 1", label: "Field Verified", range: "₹6,000–12,000/month" },
  { level: "Level 2", label: "Home Trusted", range: "₹12,000–25,000/month" },
  { level: "Level 3", label: "Senior Companion", range: "₹25,000–40,000/month" },
];

const t = {
  EN: {
    label: "FOR COMPANIONS",
    heading: "Turn your time and empathy into meaningful income.",
    body: "You do not need a degree. You need a good heart, a verified identity, and the capacity to show up. NearDear pays 80% of every session directly to you.",
    tableHeader: ["Service", "Suggested Fee", "You Earn"],
    footer: "Working ~15 hrs/week · ₹11,520/month estimated",
    ladderTitle: "Your earnings grow with your trust level",
    cta: "Start Your Application",
  },
  GU: {
    label: "સાથીઓ માટે",
    heading: "તમારો સમય અને સહાનુભૂતિ અર્થપૂર્ણ આવકમાં ફેરવો.",
    body: "ડિગ્રી જરૂરી નથી. સારું હૃદય, ચકાસાયેલ ઓળખ, અને હાજર રહેવાની ક્ષમતા જોઈએ. NearDear દરેક સત્રની 80% ચૂકવણી સીધી તમને કરે છે.",
    tableHeader: ["સેવા", "સૂચિત ફી", "તમે કમાઓ"],
    footer: "~15 કલાક/સપ્તાહ · ₹11,520/મહિને અંદાજ",
    ladderTitle: "વિશ્વાસ સ્તર સાથે કમાણી વધે છે",
    cta: "અરજી શરૂ કરો",
  },
  HI: {
    label: "साथियों के लिए",
    heading: "अपना समय और सहानुभूति अर्थपूर्ण आय में बदलें।",
    body: "डिग्री जरूरी नहीं। अच्छा दिल, सत्यापित पहचान, और उपस्थित रहने की क्षमता चाहिए। NearDear हर सत्र की 80% राशि सीधे आपको देता है।",
    tableHeader: ["सेवा", "सुझाई गई फीस", "आप कमाते हैं"],
    footer: "~15 घंटे/सप्ताह · ₹11,520/माह अनुमान",
    ladderTitle: "विश्वास स्तर के साथ कमाई बढ़ती है",
    cta: "आवेदन शुरू करें",
  },
};

export default function EarningsSection() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <section id="earnings" className="bg-[#FEF8F0] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#4A8C6F] mb-4">
            {copy.label}
          </p>
          <h2
            className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-6"
            style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
          >
            {copy.heading}
          </h2>
          <p className="text-[#6B7280] text-lg leading-relaxed">{copy.body}</p>
        </div>

        {/* Earnings table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D8] overflow-hidden mb-10">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FEF8F0] border-b border-[#E8E0D8]">
                {copy.tableHeader.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#1A6B7A] uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {earningsRows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[#E8E0D8] last:border-0 hover:bg-[#FEF8F0] transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-[#1C2B3A] font-medium">
                    {row.service}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-[family-name:var(--font-dm-mono)]"
                    style={{ color: "#9CA3AF" }}
                  >
                    {row.fee}
                  </td>
                  <td
                    className="px-4 py-3 text-sm font-[family-name:var(--font-dm-mono)] font-medium"
                    style={{ color: "#F0B429" }}
                  >
                    {row.earn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-[#FEF8F0] border-t border-[#E8E0D8]">
            <p className="text-xs text-[#9CA3AF] font-[family-name:var(--font-dm-mono)]">
              {copy.footer}
            </p>
          </div>
        </div>

        {/* Trust ladder */}
        <div className="mb-12">
          <h3 className="font-semibold text-[#1C2B3A] text-base mb-4 text-center">
            {copy.ladderTitle}
          </h3>
          <div className="space-y-3">
            {trustLadder.map((row, i) => (
              <div
                key={i}
                className="bg-white rounded-xl px-5 py-4 border border-[#E8E0D8] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: "#1A6B7A" }}
                  >
                    {row.level}
                  </span>
                  <span className="text-[#1C2B3A] text-sm font-medium">
                    {row.label}
                  </span>
                </div>
                <span
                  className="font-[family-name:var(--font-dm-mono)] text-sm font-medium"
                  style={{ color: "#F0B429" }}
                >
                  {row.range}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/apply"
            className="inline-block bg-[#4A8C6F] text-white rounded-xl px-10 py-4 text-base font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
