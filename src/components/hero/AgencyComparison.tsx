"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language";

const t = {
  EN: {
    label: "THE DIFFERENCE",
    heading: "Agencies vs NearDear",
    agencyCol: "Typical Agency",
    ndCol: "NearDear",
    rows: [
      {
        topic: "Who comes to your door",
        agency: "Whoever is available",
        nd: "A named, verified companion you chose",
      },
      {
        topic: "Accountability",
        agency: "None",
        nd: "Platform-level — flagging, review, action",
      },
      {
        topic: "Session tracking",
        agency: "None",
        nd: "GPS check-in and check-out",
      },
      {
        topic: "Visit notes",
        agency: "Never",
        nd: "Sent to family after every session",
      },
      {
        topic: "Can I remove someone?",
        agency: "Difficult",
        nd: "One tap. No explanation needed.",
      },
    ],
    ctaLabel: "Why NearDear is different →",
  },
  GU: {
    label: "ફ઼રક",
    heading: "એજન્સી vs NearDear",
    agencyCol: "સામાન્ય એજન્સી",
    ndCol: "NearDear",
    rows: [
      { topic: "દ્વારે કોણ આવે?", agency: "ઉપલબ્ધ હોય તે", nd: "તમે પસંદ કરેલ, ચકાસાયેલ સાથી" },
      { topic: "જવાબદારી", agency: "કોઈ નહીં", nd: "ફ્લૅગ, સમીક્ષા, પ્લૅટફૉર્મ-સ્તર" },
      { topic: "સત્ર ટ્રૅકિંગ", agency: "કોઈ નહીં", nd: "GPS ચેક-ઇન અને ચેક-આઉટ" },
      { topic: "મુલાકાત નોંધ", agency: "ક્યારેય નહીં", nd: "દરેક સત્ર પછી પરિવારને" },
      { topic: "કાઢી શકાય?", agency: "મુશ્કેલ", nd: "એક ટૅપ. કોઈ સ્પષ્ટીકરણ જરૂરી નહીં." },
    ],
    ctaLabel: "NearDear શા માટે અલગ છે →",
  },
  HI: {
    label: "फ़र्क",
    heading: "एजेंसी vs NearDear",
    agencyCol: "सामान्य एजेंसी",
    ndCol: "NearDear",
    rows: [
      { topic: "आपके दरवाजे पर कौन आता है", agency: "जो उपलब्ध हो", nd: "एक नामी, सत्यापित साथी जिसे आपने चुना" },
      { topic: "जवाबदेही", agency: "कोई नहीं", nd: "प्लेटफ़ॉर्म-स्तर — फ्लैग, समीक्षा, कार्रवाई" },
      { topic: "सत्र ट्रैकिंग", agency: "कोई नहीं", nd: "GPS चेक-इन और चेक-आउट" },
      { topic: "मुलाकात नोट", agency: "कभी नहीं", nd: "हर सत्र के बाद परिवार को भेजा" },
      { topic: "किसी को हटा सकते हैं?", agency: "मुश्किल", nd: "एक टैप। कोई स्पष्टीकरण जरूरी नहीं।" },
    ],
    ctaLabel: "NearDear क्यों अलग है →",
  },
};

export default function AgencyComparison() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <section className="bg-white py-16 px-4 border-y border-[#E8E0D8]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-2">
              {copy.label}
            </p>
            <h2
              className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A]"
              style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
            >
              {copy.heading}
            </h2>
          </div>
          <Link
            href="/why-neardear"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium border-2 border-[#E07B2F] text-[#E07B2F] hover:bg-[#FFF3EC] transition-colors shrink-0"
          >
            {copy.ctaLabel}
          </Link>
        </div>

        <div className="rounded-2xl overflow-hidden border border-[#E8E0D8]">
          {/* Column headers */}
          <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-widest">
            <div className="p-4 bg-[#F9FAFB] text-[#9CA3AF]" />
            <div className="p-4 bg-[#FFF3EC] text-[#E07B2F] border-l border-[#E8E0D8]">
              {copy.agencyCol}
            </div>
            <div className="p-4 bg-[#1C2B3A] text-[#F0B429] border-l border-[#E8E0D8]">
              {copy.ndCol}
            </div>
          </div>
          {/* Rows */}
          {copy.rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 border-t border-[#E8E0D8] text-sm"
            >
              <div className="p-4 font-medium text-[#1C2B3A] bg-[#F9FAFB]">
                {row.topic}
              </div>
              <div className="p-4 text-[#9CA3AF] border-l border-[#E8E0D8]">
                {row.agency}
              </div>
              <div className="p-4 text-[#1C2B3A] font-medium border-l border-[#E8E0D8]">
                <span className="text-[#4A8C6F] mr-1.5">✓</span>
                {row.nd}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
