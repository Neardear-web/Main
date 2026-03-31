"use client";

import { useLanguage } from "@/lib/language";
import Link from "next/link";

const t = {
  EN: {
    label: "FOR FAMILIES & ELDERS",
    heading: "How NearDear works for you",
    steps: [
      {
        number: "1",
        title: "Tell us what you need",
        description:
          "Describe the situation in your own words. Our AI finds the right match.",
      },
      {
        number: "2",
        title: "Meet your verified Companion",
        description:
          "Real people near your parent's location. Name, photo, trust level, sessions completed.",
      },
      {
        number: "3",
        title: "Stay connected from anywhere",
        description:
          "Companion checks in when they arrive. You receive a note after every visit. Always informed. Always in control.",
      },
    ],
    cta: "Find a Companion Now",
  },
  GU: {
    label: "પરિવાર અને વડીલો માટે",
    heading: "NearDear તમારા માટે કેવી રીતે કામ કરે છે",
    steps: [
      {
        number: "1",
        title: "તમારી જરૂર જણાવો",
        description:
          "પરિસ્થિતિ તમારા શબ્દોમાં જણાવો. અમારી AI સૌથી સારો મેળ શોધશે.",
      },
      {
        number: "2",
        title: "ચકાસાયેલ સાથીને મળો",
        description:
          "તમારા માતા-પિતાના સ્થળ નજીકના વાસ્તવિક લોકો. નામ, ફોટો, વિશ્વાસ સ્તર, પૂર્ણ સત્રો.",
      },
      {
        number: "3",
        title: "ગમે ત્યાંથી જોડાયેલ રહો",
        description:
          "સાથી પહોંચે ત્યારે ચેક ઈન કરે છે. દરેક મુલાકાત પછી તમને નોંધ મળે છે. હંમેશા જાણ. હંમેશા નિયંત્રણ.",
      },
    ],
    cta: "હવે સાથી શોધો",
  },
  HI: {
    label: "परिवार और बुजुर्गों के लिए",
    heading: "NearDear आपके लिए कैसे काम करता है",
    steps: [
      {
        number: "1",
        title: "हमें बताएं आपको क्या चाहिए",
        description:
          "स्थिति अपने शब्दों में बताएं। हमारी AI सबसे अच्छा मेल खोजेगी।",
      },
      {
        number: "2",
        title: "अपने सत्यापित साथी से मिलें",
        description:
          "आपके माता-पिता के स्थान के पास के असली लोग। नाम, फोटो, विश्वास स्तर, पूर्ण सत्र।",
      },
      {
        number: "3",
        title: "कहीं से भी जुड़े रहें",
        description:
          "साथी पहुंचने पर चेक इन करता है। हर मुलाकात के बाद आपको नोट मिलता है। हमेशा सूचित। हमेशा नियंत्रण में।",
      },
    ],
    cta: "अभी साथी खोजें",
  },
};

export default function HowItWorks() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <section id="how-it-works" className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-4">
            {copy.label}
          </p>
          <h2
            className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A]"
            style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
          >
            {copy.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {copy.steps.map((step) => (
            <div key={step.number} className="flex flex-col items-start">
              <div className="w-12 h-12 rounded-full bg-[#E07B2F] text-white flex items-center justify-center font-[family-name:var(--font-playfair)] font-bold text-lg mb-4 shrink-0">
                {step.number}
              </div>
              <h3 className="font-semibold text-[#1C2B3A] text-base mb-2">
                {step.title}
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center md:justify-start">
          <Link
            href="/request/new"
            className="w-full md:w-auto text-center bg-[#E07B2F] text-white rounded-xl px-8 py-4 text-base font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
