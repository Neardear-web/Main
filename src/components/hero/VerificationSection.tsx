"use client";

import { useLanguage } from "@/lib/language";
import Link from "next/link";

const t = {
  EN: {
    heading:
      "Three layers of verification. Every companion. Every time.",
    pillars: [
      {
        label: "X — IDENTITY VERIFICATION",
        accent: "#1A6B7A",
        body: "Aadhaar confirmed. Live selfie matched. Address verified. Police Clearance Certificate reviewed. Renewed every 12 months.",
      },
      {
        label: "Y — CHARACTER VERIFICATION",
        accent: "#4A8C6F",
        body: "Two personal references contacted by phone. Video interview with NearDear team. Empathy, boundaries, communication — all assessed. Code of Conduct signed before first session.",
      },
      {
        label: "Z — ONGOING INTEGRITY MONITORING",
        accent: "#E07B2F",
        body: "Every session tracked. Check-in. Check-out. Post-session note reviewed. User feedback every session. Annual re-verification. Concern flagging always open.",
      },
    ],
    quote:
      "After all this — yes. You are still dealing with human beings. But we have done everything a platform can do to ensure the right ones reach your door.",
    cta: "Read our full safety framework",
  },
  GU: {
    heading: "ત્રણ સ્તરની ચકાસણી. દરેક સાથી. દર વખતે.",
    pillars: [
      {
        label: "X — ઓળખ ચકાસણી",
        accent: "#1A6B7A",
        body: "આધાર પુષ્ટિ. લાઈવ સેલ્ફી મેળ. સરનામું ચકાસ્યું. પોલીસ ક્લિઅરન્સ સર્ટિફિકેટ. દર 12 મહિને નવીનીકરણ.",
      },
      {
        label: "Y — ચારિત્ર્ય ચકાસણી",
        accent: "#4A8C6F",
        body: "ફોન પર બે વ્યક્તિગત સંદર્ભ. NearDear ટીમ સાથે વીડિયો ઇન્ટરવ્યૂ. સહાનુભૂતિ, સીમા, સંવાદ — બધું મૂલ્યાંકન. પ્રથમ સત્ર પહેલાં આચારસંહિતા.",
      },
      {
        label: "Z — સતત નૈતિકતા દેખરેખ",
        accent: "#E07B2F",
        body: "દરેક સત્ર ટ્રૅક. ચેક-ઈન. ચેક-આઉટ. સત્ર નોંધ. દરેક સત્ર પ્રતિભાવ. વાર્ષિક ફરી ચકાસણી. ચિંતા ફ્લૅગ સદા ખુલ્લો.",
      },
    ],
    quote:
      "આ બધા પછી — હા. તમે હજી માનવ વ્યક્તિઓ સાથે કામ કરી રહ્યા છો. પણ અમે પ્લેટફોર્મ કરી શકે એ બધું કર્યું છે કે સાચા લોકો તમારા દ્વારે પહોંચે.",
    cta: "અમારો સંપૂર્ણ સુરક્ષા માળખો વાંચો",
  },
  HI: {
    heading: "तीन स्तरीय सत्यापन। हर साथी। हर बार।",
    pillars: [
      {
        label: "X — पहचान सत्यापन",
        accent: "#1A6B7A",
        body: "आधार पुष्टि। लाइव सेल्फी मिलान। पता सत्यापित। पुलिस क्लियरेंस सर्टिफिकेट। हर 12 महीने नवीनीकरण।",
      },
      {
        label: "Y — चरित्र सत्यापन",
        accent: "#4A8C6F",
        body: "फोन पर दो व्यक्तिगत संदर्भ। NearDear टीम के साथ वीडियो साक्षात्कार। सहानुभूति, सीमाएं, संवाद — सब मूल्यांकित। पहले सत्र से पहले आचार संहिता।",
      },
      {
        label: "Z — निरंतर ईमानदारी निगरानी",
        accent: "#E07B2F",
        body: "हर सत्र ट्रैक। चेक-इन। चेक-आउट। सत्र नोट समीक्षित। हर सत्र परिवार की प्रतिक्रिया। वार्षिक पुनः सत्यापन। चिंता फ्लैग हमेशा खुला।",
      },
    ],
    quote:
      "इन सबके बाद — हां। आप अभी भी इंसानों के साथ काम कर रहे हैं। लेकिन हमने वह सब किया है जो एक प्लेटफ़ॉर्म कर सकता है, ताकि सही लोग आपके दरवाजे तक पहुंचें।",
    cta: "हमारा पूर्ण सुरक्षा ढांचा पढ़ें",
  },
};

export default function VerificationSection() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A]"
            style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
          >
            {copy.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {copy.pillars.map((pillar) => (
            <div key={pillar.label} className="flex flex-col">
              <div
                className="w-1 h-8 rounded-full mb-4"
                style={{ backgroundColor: pillar.accent }}
              />
              <h3
                className="font-semibold text-sm mb-3 uppercase tracking-wide"
                style={{ color: pillar.accent }}
              >
                {pillar.label}
              </h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

        <blockquote className="text-center max-w-2xl mx-auto mb-10">
          <p className="italic text-[#1C2B3A] text-lg leading-relaxed">
            &ldquo;{copy.quote}&rdquo;
          </p>
        </blockquote>

        <div className="text-center">
          <Link
            href="/safety"
            className="inline-block border-2 border-[#1A6B7A] text-[#1A6B7A] rounded-xl px-8 py-3 text-sm font-semibold hover:bg-[#1A6B7A] hover:text-white transition-colors"
          >
            {copy.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
