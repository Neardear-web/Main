"use client";

import { useLanguage } from "@/lib/language";
import Link from "next/link";

const t = {
  EN: {
    label: "FOR FAMILIES ABROAD",
    heading: "You are in Toronto.\nYour mother is in Rajkot.\nNearDear is there.",
    body: "Set up care for your parent from anywhere. We check in when they arrive. We send you a note after every visit. Across time zones. Across distances.",
    features: [
      { icon: "📍", title: "GPS check-in", desc: "Know when they arrive" },
      { icon: "📝", title: "Post-visit note", desc: "Know what happened" },
      { icon: "🔔", title: "Concern alert", desc: "Know immediately" },
    ],
    cta: "Set up care for my parent",
  },
  GU: {
    label: "વિદેશ સ્થિત પરિવાર માટે",
    heading: "તમે ટોરોન્ટોમાં છો.\nતમારી માતા રાજકોટમાં છે.\nNearDear ત્યાં છે.",
    body: "ગમે ત્યાંથી તમારા માતા-પિતા માટે સંભાળ ગોઠવો. સાથી પહોંચે ત્યારે ચેક ઈન કરે. દરેક મુલાકાત પછી નોંધ મળે. સમય ઝોન અને અંતર ઓળંગી.",
    features: [
      { icon: "📍", title: "GPS હાજરી", desc: "ક્યારે પહોંચ્યા જાણો" },
      { icon: "📝", title: "મુલાકાત પછી નોંધ", desc: "શું થયું જાણો" },
      { icon: "🔔", title: "ચિંતા સૂચના", desc: "તત્કાલ જાણો" },
    ],
    cta: "મારા માતા-પિતા માટે સંભાળ ગોઠવો",
  },
  HI: {
    label: "विदेश में परिवारों के लिए",
    heading: "आप टोरंटो में हैं।\nआपकी माँ राजकोट में हैं।\nNearDear वहां है।",
    body: "कहीं से भी अपने माता-पिता के लिए देखभाल व्यवस्थित करें। साथी पहुंचने पर चेक इन करता है। हर मुलाकात के बाद नोट मिलता है। समय क्षेत्र और दूरी से परे।",
    features: [
      { icon: "📍", title: "GPS चेक-इन", desc: "जानें कब पहुंचे" },
      { icon: "📝", title: "मुलाकात के बाद नोट", desc: "जानें क्या हुआ" },
      { icon: "🔔", title: "चिंता अलर्ट", desc: "तुरंत जानें" },
    ],
    cta: "मेरे माता-पिता के लिए देखभाल व्यवस्थित करें",
  },
};

export default function NRISection() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <section className="bg-[#1A6B7A] py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-6">
          {copy.label}
        </p>
        <h2
          className="font-[family-name:var(--font-playfair)] font-bold text-white leading-tight mb-8"
          style={{ fontSize: "clamp(28px, 4vw, 42px)" }}
        >
          {copy.heading.split("\n").map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h2>
        <p className="text-white/80 text-lg leading-relaxed mb-12">
          {copy.body}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {copy.features.map((f) => (
            <div key={f.title} className="flex flex-col items-center">
              <span className="text-4xl mb-3">{f.icon}</span>
              <p className="text-white font-semibold text-base mb-1">
                {f.title}
              </p>
              <p className="text-white/70 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>

        <Link
          href="/request/new"
          className="inline-block bg-[#E07B2F] text-white rounded-xl px-10 py-4 text-base font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          {copy.cta}
        </Link>
      </div>
    </section>
  );
}
