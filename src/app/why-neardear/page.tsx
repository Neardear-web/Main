"use client";

import Link from "next/link";
import Header from "@/components/hero/Header";
import Footer from "@/components/hero/Footer";
import { useLanguage } from "@/lib/language";

const t = {
  EN: {
    heroLabel: "WHY NEARDEAR?",
    heroLines: [
      { left: "Because agencies send whoever is available.", right: "NearDear sends someone you know by name." },
      { left: "Because agencies have no accountability.", right: "NearDear tracks every session, every minute." },
      { left: "Because your parent deserves more than an anonymous face at the door.", right: "" },
    ],
    heroClosure:
      "This is not a staffing agency. This is a trust infrastructure.",

    checklistHeading: "Every NearDear companion is:",
    checklist: [
      "Identity verified through Aadhaar",
      "Police clearance checked",
      "Personally interviewed by our team",
      "Trained in our Code of Conduct",
      "GPS tracked on every visit",
      "Reviewed after every session",
    ],

    comparisonLabel: "THE REAL DIFFERENCE",
    comparisonHeading: "What agencies give you vs what NearDear gives you.",
    agencyCol: "Typical Agency",
    ndCol: "NearDear",
    rows: [
      { topic: "Who comes to your door", agency: "Whoever is available", nd: "A named, verified companion you chose" },
      { topic: "Accountability", agency: "None — you deal with it yourself", nd: "Platform-level — flagging, review, action" },
      { topic: "Session tracking", agency: "None", nd: "GPS check-in and check-out, timestamped" },
      { topic: "Visit notes", agency: "Never", nd: "Structured note sent to family after every session" },
      { topic: "Background check", agency: "Informal at best", nd: "Aadhaar, PCC, references, interview" },
      { topic: "Can I remove someone?", agency: "Difficult — re-negotiation required", nd: "One tap. No explanation needed." },
      { topic: "Feedback system", agency: "No", nd: "After every session. Reviewed by admin." },
    ],

    verifyLabel: "OUR THREE-LAYER VERIFICATION",
    verifyX: {
      tag: "X — Identity",
      items: ["Aadhaar through government API", "Live selfie matched to ID", "Address verified", "Police Clearance Certificate reviewed"],
    },
    verifyY: {
      tag: "Y — Character",
      items: ["Two personal references called by phone", "Structured video interview — empathy, communication, boundaries"],
    },
    verifyZ: {
      tag: "Z — Ongoing",
      items: ["GPS check-in + check-out on every visit", "Post-session note reviewed", "Family feedback after every session", "Annual re-verification"],
    },

    numbersLabel: "REAL ACCOUNTABILITY, BUILT IN",
    numbers: [
      { stat: "100%", label: "Sessions GPS tracked" },
      { stat: "3 layers", label: "Verification before first session" },
      { stat: "24h", label: "Concern review SLA" },
      { stat: "48h", label: "Companion payment — every session" },
    ],

    ctaLabel: "Find a NearDear →",
    ctaSub: "Ahmedabad · Gandhinagar",
  },
  GU: {
    heroLabel: "નિયરડિયર જ શા માટે?",
    heroLines: [
      { left: "એજન્સીઓ ઉપલબ્ધ હોય તેને મોકલે.", right: "નિયરડિયર જેને તમે નામ અને કામથી ઓળખો છો તેને મોકલે." },
      { left: "એજન્સીઓ કોઈ જવાબ નથી આપતી.", right: "નિયરડિયર દરેક સત્ર, દરેક મિનિટ ટ્રૅક કરે." },
      { left: "તમારા માતા-પિતા અજાણ્યા ચહેરાઓ નહીં, ભરોસાપાત્ર સાથીદારના હકદાર છે.", right: "" },
    ],
    heroClosure: "આ સ્ટાફિંગ એજન્સી નથી. આ ભરોસા-ઇન્ફ્રાસ્ટ્રક્ચર છે.",

    checklistHeading: "દરેક NearDear સાથીદાર:",
    checklist: [
      "આધાર દ્વારા ઓળખ ચકાસણી",
      "PCC (પૉલિસ ક્લિયરન્સ) ચકાસણી",
      "ટીમ સાથે ઇન્ટર્વ્યૂ",
      "Code of Conduct ટ્રેઇનિંગ",
      "દરેક મુલાકાતે GPS ટ્રૅક",
      "દરેક સત્ર પછી સમીક્ષા",
    ],

    comparisonLabel: "વાસ્તવિક ફેર",
    comparisonHeading: "એજન્સી vs NearDear.",
    agencyCol: "સામાન્ય એજન્સી",
    ndCol: "NearDear",
    rows: [
      { topic: "કોણ આવે?", agency: "ઉપલબ્ધ હોય તે", nd: "તમે પસંદ કરેલ, ચકાસાયેલ સાથીદાર" },
      { topic: "જવાબદારી", agency: "કોઈ નહીં", nd: "ફ્લૅગ, સમીક્ષા, પગલું" },
      { topic: "ટ્રૅકિંગ", agency: "કોઈ નહીં", nd: "GPS ચેક-ઇન/ઓઉટ" },
      { topic: "રિપોર્ટ", agency: "ક્યારેય નહીં", nd: "દરેક સત્ર પછી" },
      { topic: "ચકાસણી", agency: "અનૌપચારિક", nd: "આધાર, PCC, સંદર્ભ, ઇન્ટ્ ્યૂ" },
      { topic: "કાઢી શકાય?", agency: "મુશ્કેલ", nd: "એક ટૅપ" },
      { topic: "ફીડબૅક", agency: "ના", nd: "હા, દરેક સત્ર" },
    ],

    verifyLabel: "ત્રણ-સ્તરની ચકાસણી",
    verifyX: {
      tag: "X — ઓળખ",
      items: ["સરકારી API દ્વારા આધાર", "લાઇવ સેલ્ફી ID સાથે", "સરનામું ચકાસણી", "PCC"],
    },
    verifyY: {
      tag: "Y — ચારિત્ર્ય",
      items: ["બે સંદર્ભ ફોન ઉપર", "વિડિઓ ઇન્ટર્વ્યૂ — સહાનુભૂતિ, સંવાદ, સીમા"],
    },
    verifyZ: {
      tag: "Z — ચાલુ",
      items: ["GPS ચેક-ઇન + ઓઉટ", "સત્ર-પછી-નોટ", "દરેક સત્ર પ્રતિભાવ", "વાર્ષિક ફરી ચકાસણી"],
    },

    numbersLabel: "વાસ્તવિક જવાબદારી",
    numbers: [
      { stat: "100%", label: "GPS ટ્રૅક સત્રો" },
      { stat: "3 સ્તર", label: "પ્રથમ સત્ર પહેલાં ચકાસણી" },
      { stat: "24 કલાક", label: "ચિંતા સમીક્ષા SLA" },
      { stat: "48 કલાક", label: "સાથી ચૂકવણી — દરેક સત્ર" },
    ],

    ctaLabel: "NearDear શોધો →",
    ctaSub: "અહ્મદાબાદ · ગાંધીનગર",
  },
  HI: {
    heroLabel: "NearDear क्यों?",
    heroLines: [
      { left: "क्योंकि एजेंसियां जो उपलब्ध हो उसे भेज देती हैं।", right: "NearDear किसी को भेजता है जिसे आप नाम से जानते हैं।" },
      { left: "क्योंकि एजेंसियों की कोई जवाबदेही नहीं होती।", right: "NearDear हर सत्र, हर मिनट ट्रैक करता है।" },
      { left: "क्योंकि आपके माता-पिता एक अनजान चेहरे से बेहतर के हकदार हैं।", right: "" },
    ],
    heroClosure: "यह एक स्टाफिंग एजेंसी नहीं है। यह एक विश्वास का ढांचा है।",

    checklistHeading: "हर NearDear साथी है:",
    checklist: [
      "आधार के ज़रिए पहचान सत्यापित",
      "पुलिस क्लियरेंस जांचा हुआ",
      "हमारी टीम द्वारा साक्षात्कार लिया गया",
      "आचार संहिता में प्रशिक्षित",
      "हर मुलाकात पर GPS ट्रैक",
      "हर सत्र के बाद समीक्षित",
    ],

    comparisonLabel: "असली फ़र्क",
    comparisonHeading: "एजेंसियां क्या देती हैं बनाम NearDear क्या देता है।",
    agencyCol: "सामान्य एजेंसी",
    ndCol: "NearDear",
    rows: [
      { topic: "आपके दरवाजे पर कौन आता है", agency: "जो उपलब्ध हो", nd: "एक नामी, सत्यापित साथी जिसे आपने चुना" },
      { topic: "जवाबदेही", agency: "कोई नहीं — खुद निपटें", nd: "प्लेटफ़ॉर्म-स्तर — फ्लैग, समीक्षा, कार्रवाई" },
      { topic: "सत्र ट्रैकिंग", agency: "कोई नहीं", nd: "GPS चेक-इन और चेक-आउट, टाइमस्टैंप" },
      { topic: "मुलाकात नोट", agency: "कभी नहीं", nd: "हर सत्र के बाद परिवार को संरचित नोट" },
      { topic: "पृष्ठभूमि जांच", agency: "अनौपचारिक", nd: "आधार, PCC, संदर्भ, साक्षात्कार" },
      { topic: "किसी को हटा सकते हैं?", agency: "मुश्किल — पुनः बातचीत जरूरी", nd: "एक टैप। कोई स्पष्टीकरण जरूरी नहीं।" },
      { topic: "फीडबैक सिस्टम", agency: "नहीं", nd: "हर सत्र के बाद। admin द्वारा समीक्षित।" },
    ],

    verifyLabel: "हमारा तीन-स्तरीय सत्यापन",
    verifyX: {
      tag: "X — पहचान",
      items: ["सरकारी API के ज़रिए आधार", "लाइव सेल्फी ID से मिलान", "पता सत्यापित", "पुलिस क्लियरेंस सर्टिफिकेट"],
    },
    verifyY: {
      tag: "Y — चरित्र",
      items: ["फोन पर दो व्यक्तिगत संदर्भ", "संरचित वीडियो साक्षात्कार — सहानुभूति, संवाद, सीमाएं"],
    },
    verifyZ: {
      tag: "Z — निरंतर",
      items: ["हर मुलाकात पर GPS चेक-इन + आउट", "सत्र नोट समीक्षित", "हर सत्र परिवार की प्रतिक्रिया", "वार्षिक पुनः सत्यापन"],
    },

    numbersLabel: "वास्तविक जवाबदेही, अंतर्निहित",
    numbers: [
      { stat: "100%", label: "GPS ट्रैक सत्र" },
      { stat: "3 स्तर", label: "पहले सत्र से पहले सत्यापन" },
      { stat: "24 घंटे", label: "चिंता समीक्षा SLA" },
      { stat: "48 घंटे", label: "साथी भुगतान — हर सत्र" },
    ],

    ctaLabel: "NearDear खोजें →",
    ctaSub: "अहमदाबाद · गांधीनगर",
  },
};

export default function WhyNearDearPage() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <>
      <Header />
      <main>
        {/* Hero — Deep Night bg, white text, contrast-heavy */}
        <section className="bg-[#1C2B3A] text-white py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F0B429] mb-10">
              {copy.heroLabel}
            </p>
            <div className="space-y-8 mb-12">
              {copy.heroLines.map((line, i) => (
                <div key={i}>
                  <p
                    className="text-[#9CA3AF] leading-relaxed mb-1"
                    style={{ fontSize: "clamp(16px, 2vw, 20px)" }}
                  >
                    {line.left}
                  </p>
                  {line.right && (
                    <p
                      className="font-[family-name:var(--font-playfair)] font-bold text-white leading-tight"
                      style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
                    >
                      {line.right}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Checklist */}
            <div className="border border-white/20 rounded-2xl p-8 mb-10 bg-white/5">
              <p className="font-semibold text-[#F0B429] mb-5 text-sm tracking-wide">
                {copy.checklistHeading}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {copy.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[#4A8C6F] font-bold text-lg shrink-0">✓</span>
                    <span className="text-white/90 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <p
              className="font-[family-name:var(--font-playfair)] font-semibold text-[#E07B2F] italic"
              style={{ fontSize: "clamp(18px, 2vw, 22px)" }}
            >
              {copy.heroClosure}
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-[#FEF8F0] py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-4">
              {copy.comparisonLabel}
            </p>
            <h2
              className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-10"
              style={{ fontSize: "clamp(22px, 3vw, 32px)" }}
            >
              {copy.comparisonHeading}
            </h2>
            <div className="rounded-2xl overflow-hidden border border-[#E8E0D8] bg-white">
              {/* Header row */}
              <div className="grid grid-cols-3 text-xs font-semibold uppercase tracking-widest">
                <div className="p-4 bg-[#F9FAFB] text-[#6B7280]">Topic</div>
                <div className="p-4 bg-[#FFF3EC] text-[#E07B2F] border-l border-[#E8E0D8]">
                  {copy.agencyCol}
                </div>
                <div className="p-4 bg-[#1C2B3A] text-[#F0B429] border-l border-[#E8E0D8]">
                  {copy.ndCol}
                </div>
              </div>
              {/* Data rows */}
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
                    {row.nd}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Three verifications */}
        <section className="bg-white py-20 px-4 border-y border-[#E8E0D8]">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-10">
              {copy.verifyLabel}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[copy.verifyX, copy.verifyY, copy.verifyZ].map((v, idx) => {
                const styles = [
                  { bg: "#1C2B3A", label: "#F0B429" },
                  { bg: "#1A6B7A", label: "#FEF8F0" },
                  { bg: "#4A8C6F", label: "#FEF8F0" },
                ];
                const s = styles[idx];
                return (
                  <div
                    key={v.tag}
                    className="rounded-2xl p-6 text-white"
                    style={{ backgroundColor: s.bg }}
                  >
                    <p
                      className="text-xs font-bold tracking-widest uppercase mb-4"
                      style={{ color: s.label }}
                    >
                      {v.tag}
                    </p>
                    <ul className="space-y-2">
                      {v.items.map((item, i) => (
                        <li key={i} className="text-sm text-white/90 flex items-start gap-2">
                          <span className="shrink-0 mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Numbers */}
        <section className="bg-[#FEF8F0] py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-10">
              {copy.numbersLabel}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {copy.numbers.map((n) => (
                <div
                  key={n.stat}
                  className="bg-white rounded-2xl p-6 border border-[#E8E0D8] text-center"
                >
                  <p
                    className="font-[family-name:var(--font-playfair)] font-bold text-[#E07B2F] mb-2"
                    style={{ fontSize: "clamp(28px, 4vw, 40px)" }}
                  >
                    {n.stat}
                  </p>
                  <p className="text-[#6B7280] text-sm">{n.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#1C2B3A] py-20 px-4 text-center">
          <Link
            href="/request/new"
            className="inline-flex items-center px-10 py-5 bg-[#E07B2F] text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity mb-3"
          >
            {copy.ctaLabel}
          </Link>
          <p className="text-[#9CA3AF] text-sm mt-3">{copy.ctaSub}</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
