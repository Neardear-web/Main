"use client";

import Link from "next/link";
import Header from "@/components/hero/Header";
import Footer from "@/components/hero/Footer";
import { useLanguage } from "@/lib/language";

const t = {
  EN: {
    label: "FAQ",
    heading: "How can we help you?",
    sub: "Choose your path below.",
    familyTitle: "I need help for my parent or elder family member",
    familySub: "For families, caregivers, and elders seeking support",
    familyCta: "Read FAQ for Families →",
    companionTitle: "I want to join NearDear as a companion",
    companionSub: "For people interested in providing care and support",
    companionCta: "Read FAQ for Companions →",
    still: "Still have a question?",
    stillSub: "We are happy to help directly.",
    whatsapp: "WhatsApp us",
    email: "Email us",
  },
  GU: {
    label: "FAQ",
    heading: "અમે કઈ રીતે મદદ કરી શકીએ?",
    sub: "નીચે તમારો રસ્તો પસંદ કરો.",
    familyTitle: "મારા માતા-પિતા અથવા વૃદ્ધ સ્વજન માટે સહાય ઈચ્છું છું",
    familySub: "પરિવાર, સંભાળ આપનારા, અને વૃદ્ધ વ્યક્તિઓ માટે",
    familyCta: "પ ÉÉ →",
    companionTitle: "NearDear સ ÉÉ ÉÉ ÉÉ",
    companionSub: "ÉÉ ÉÉ ÉÉ ÉÉ ÉÉ",
    companionCta: "ÉÉ →",
    still: "É É?",
    stillSub: "É É É É.",
    whatsapp: "WhatsApp É",
    email: "É É",
  },
  HI: {
    label: "FAQ",
    heading: "हम आपकी कैसे मदद कर सकते हैं?",
    sub: "नीचे अपना रास्ता चुनें।",
    familyTitle: "मुझे अपने माता-पिता या बुजुर्ग के लिए सहायता चाहिए",
    familySub: "परिवार, देखभालकर्ता, और बुजुर्गों के लिए",
    familyCta: "परिवार FAQ पढ़ें →",
    companionTitle: "मैं NearDear में साथी के रूप में जुड़ना चाहता हूं",
    companionSub: "देखभाल और सहायता प्रदान करने में रुचि रखने वालों के लिए",
    companionCta: "साथी FAQ पढ़ें →",
    still: "अभी भी प्रश्न है?",
    stillSub: "हम सीधे मदद करने में खुश हैं।",
    whatsapp: "WhatsApp करें",
    email: "ईमेल करें",
  },
};

export default function FaqPage() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <>
      <Header />
      <main className="bg-[#FEF8F0] min-h-screen">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-6">
              {copy.label}
            </p>
            <h1
              className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-3"
              style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
            >
              {copy.heading}
            </h1>
            <p className="text-[#6B7280] text-lg">{copy.sub}</p>
          </div>
        </section>

        {/* Two cards */}
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Families card */}
            <Link
              href="/faq/families"
              className="group bg-white rounded-2xl p-8 border-2 hover:shadow-lg transition-all flex flex-col"
              style={{ borderColor: "#E07B2F" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                style={{ backgroundColor: "#FFF3EC" }}
              >
                🏠
              </div>
              <h2
                className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-3 leading-snug"
                style={{ fontSize: "clamp(18px, 2vw, 22px)" }}
              >
                {copy.familyTitle}
              </h2>
              <p className="text-[#6B7280] text-sm mb-6 flex-1">{copy.familySub}</p>
              <span className="text-[#E07B2F] font-semibold text-sm group-hover:underline">
                {copy.familyCta}
              </span>
            </Link>

            {/* Companions card */}
            <Link
              href="/faq/companions"
              className="group bg-white rounded-2xl p-8 border-2 hover:shadow-lg transition-all flex flex-col"
              style={{ borderColor: "#4A8C6F" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6"
                style={{ backgroundColor: "#F0FAF4" }}
              >
                🤝
              </div>
              <h2
                className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-3 leading-snug"
                style={{ fontSize: "clamp(18px, 2vw, 22px)" }}
              >
                {copy.companionTitle}
              </h2>
              <p className="text-[#6B7280] text-sm mb-6 flex-1">{copy.companionSub}</p>
              <span className="text-[#4A8C6F] font-semibold text-sm group-hover:underline">
                {copy.companionCta}
              </span>
            </Link>
          </div>
        </section>

        {/* Still have a question */}
        <section className="pb-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] text-xl mb-2">
              {copy.still}
            </p>
            <p className="text-[#6B7280] text-sm mb-6">{copy.stillSub}</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a
                href="https://wa.me/917600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#25D366" }}
              >
                <span>💬</span> {copy.whatsapp}
              </a>
              <a
                href="mailto:hello@neardear.in"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm border-2 hover:opacity-80 transition-opacity"
                style={{ borderColor: "#1A6B7A", color: "#1A6B7A" }}
              >
                <span>✉️</span> {copy.email}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
