"use client";

import { useLanguage } from "@/lib/language";
import Link from "next/link";

const t = {
  EN: {
    receiverLabel: "FOR FAMILIES & ELDERS",
    receiverHeading: "Your parents are alone\nback home?",
    receiverBody:
      "Find a verified NearDear companion in their city. Someone who shows up, sits with them, and keeps you informed.",
    receiverCta: "Find a NearDear",
    receiverLink: "How does it work? →",
    providerLabel: "FOR COMPANIONS",
    providerHeading: "Skill, empathy and time\nare with you?",
    providerBody:
      "Contribute as a NearDear Companion. The portal pays 80% of every session directly to you.",
    providerCta: "Start Contributing",
    providerLink: "See what you can earn →",
  },
  GU: {
    receiverLabel: "પરિવાર અને વડીલો માટે",
    receiverHeading: "તમારા માતા-પિતા ઘરે\nએકલા છે?",
    receiverBody:
      "તેમના શહેરમાં વિશ્વસનીય નિયરડિયર સાથી શોધો. જે આવે, સાથ આપે, અને તમને જાણ કરે.",
    receiverCta: "નિયરડિયર શોધો",
    receiverLink: "આ કેવી રીતે કામ કરે છે? →",
    providerLabel: "સાથીઓ માટે",
    providerHeading: "તમારી પાસે કૌશલ્ય,\nસહાનુભૂતિ અને સમય છે?",
    providerBody:
      "નિયરડિયર સાથી બનો. પ્લેટફોર્મ દરેક સેવાની 80% આવક સીધી તમને ચૂકવે છે.",
    providerCta: "શરૂ કરો",
    providerLink: "તમે કેટલું કમાઈ શકો છો તે જુઓ →",
  },
  HI: {
    receiverLabel: "परिवार और बुजुर्गों के लिए",
    receiverHeading: "आपके माता-पिता घर पर\nअकेले हैं?",
    receiverBody:
      "उनके शहर में एक विश्वसनीय NearDear साथी खोजें। जो आए, साथ दे, और आपको सूचित करे।",
    receiverCta: "NearDear खोजें",
    receiverLink: "यह कैसे काम करता है? →",
    providerLabel: "साथियों के लिए",
    providerHeading: "आपके पास कौशल,\nसहानुभूति और समय है?",
    providerBody:
      "NearDear साथी बनें। प्लेटफ़ॉर्म हर सत्र की 80% राशि सीधे आपको देता है।",
    providerCta: "शुरू करें",
    providerLink: "आप कितना कमा सकते हैं देखें →",
  },
};

export default function HeroSplit() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex flex-col md:flex-row">
      {/* LEFT — Receiver */}
      <div
        className="flex-1 flex items-center justify-center px-8 py-16 md:py-0 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FEF8F0 0%, #FDF0DC 50%, #FEF8F0 100%)",
        }}
      >
        {/* Subtle decorative circles */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #E07B2F 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #1A6B7A 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[480px] w-full">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-4">
            {copy.receiverLabel}
          </p>
          <h1
            className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] leading-tight mb-6"
            style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            {copy.receiverHeading.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed max-w-[400px] mb-8">
            {copy.receiverBody}
          </p>
          <div className="flex flex-col items-start gap-3">
            <Link
              href="/request/new"
              className="inline-block bg-[#E07B2F] text-white rounded-xl px-8 py-4 text-base font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              {copy.receiverCta}
            </Link>
            <Link
              href="#how-it-works"
              className="text-[#1A6B7A] underline underline-offset-2 text-sm hover:opacity-80 transition-opacity"
            >
              {copy.receiverLink}
            </Link>
          </div>
        </div>
      </div>

      {/* CENTER DIVIDER — desktop only */}
      <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 flex-col items-center justify-center z-20 pointer-events-none">
        <div className="flex-1 w-px bg-[#E8E0D8]" />
        <div className="bg-[#E07B2F] text-white rounded-full w-12 h-12 flex items-center justify-center font-[family-name:var(--font-playfair)] font-bold text-sm shadow-md my-2 pointer-events-auto">
          ND
        </div>
        <div className="flex-1 w-px bg-[#E8E0D8]" />
      </div>

      {/* RIGHT — Provider */}
      <div
        className="flex-1 flex items-center justify-center px-8 py-16 md:py-0 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #4A8C6F 0%, #3d7a5f 100%)",
        }}
      >
        {/* Subtle decorative circles */}
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, #F0B429 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[480px] w-full">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/80 mb-4">
            {copy.providerLabel}
          </p>
          <h2
            className="font-[family-name:var(--font-playfair)] font-bold text-white leading-tight mb-6"
            style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            {copy.providerHeading.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-[400px] mb-8">
            {copy.providerBody}
          </p>
          <div className="flex flex-col items-start gap-3">
            <Link
              href="/apply"
              className="inline-block bg-white text-[#4A8C6F] rounded-xl px-8 py-4 text-base font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              {copy.providerCta}
            </Link>
            <Link
              href="#earnings"
              className="text-white underline underline-offset-2 text-sm hover:opacity-80 transition-opacity"
            >
              {copy.providerLink}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
