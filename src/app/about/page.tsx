"use client";

import Link from "next/link";
import Header from "@/components/hero/Header";
import Footer from "@/components/hero/Footer";
import { useLanguage } from "@/lib/language";

const t = {
  EN: {
    label: "ABOUT NEARDEAR",
    heading: "We did not build this\nfrom a whiteboard.",
    subheading: "We built it from understanding.",

    storyLabel: "THE FOUNDING THOUGHT",
    storyBody: [
      "We are living through a quiet crisis that has no name.",
      "Children migrate to Bengaluru, Dubai, Toronto. Parents stay behind in Ahmedabad, Rajkot, Surat. Joint families dissolve. The person who used to handle the doctor visit, the medicine pickup, the quiet Tuesday afternoon — is no longer in the same city.",
      "A 74-year-old woman does not need a financial advisor. She needs someone to sit with her. To talk to her. To notice if she seems unwell and tell her family. To accompany her to the hospital without making her feel like a burden.",
      "That person — the neighbour who used to check in, the relative who lived nearby, the familiar face at the door — is disappearing. Not because people have stopped caring. But because life has pulled everyone in different directions.",
      "NearDear exists for that gap.",
    ],

    whatLabel: "WHAT WE ARE",
    whatHeading: "India's first human-presence marketplace.",
    whatBody:
      "NearDear.in connects families with verified, trained companions who provide real human help — elder care, personal care, hospital visits, medicine pickup, emotional support, and more — in Ahmedabad and Gandhinagar.",
    whatNote:
      "We are not a staffing agency. We are not a medical service. We are not an app replacing human connection. We are the opposite: a platform that holds space for human connection in an age that is rapidly forgetting how essential it is.",

    principleLabel: "THE FOUNDING PRINCIPLE",
    principleQuestion:
      "Every decision we make — every feature, every policy, every line of code — is held against one question:",
    principleQuote:
      '"How do we create a platform where vulnerable people can receive human help with the maximum possible safety, traceability, dignity, and accountability?"',
    principles: [
      {
        word: "Safety",
        desc: "The person must not be harmed by the very help they sought.",
      },
      {
        word: "Traceability",
        desc: "Every session is tracked. Every check-in is timestamped. Every visit note reaches the family. Nothing happens off the record.",
      },
      {
        word: "Dignity",
        desc: "The person receiving help is a human being with full personhood. Not a case. Not a task. A person.",
      },
      {
        word: "Accountability",
        desc: "When something goes wrong, there is a clear answer to: who is responsible? We do not hide behind disclaimers.",
      },
    ],

    verifyLabel: "HOW WE VERIFY EVERY COMPANION",
    verifyIntro:
      "We do not let anyone through our door easily. Every NearDear companion undergoes:",
    verifyX: {
      tag: "X — Identity Verification",
      items: [
        "Aadhaar number confirmed through the government system",
        "Live selfie matched to ID",
        "Residential address verified",
        "Police Clearance Certificate reviewed and renewed annually",
      ],
    },
    verifyY: {
      tag: "Y — Character Verification",
      items: [
        "Two personal references contacted by phone — not family, people from the community",
        "A structured video interview with our team",
        "We assess empathy, communication, boundary awareness, and response to difficult situations",
      ],
    },
    verifyZ: {
      tag: "Z — Ongoing Integrity Monitoring",
      items: [
        "Every session tracked with GPS check-in and check-out",
        "Post-session notes reviewed",
        "Family feedback collected after every visit",
        "Annual re-verification required",
        "Concern flagging always open",
      ],
    },
    verifyNote:
      "After all of this — yes. You are still dealing with human beings. Some may disappoint. But this system makes bad behaviour structurally costly and visible. And it makes good behaviour the natural path for good people.",

    whereLabel: "WHERE WE OPERATE",
    whereBody:
      "Currently serving Ahmedabad and Gandhinagar. Expanding to Surat, Vadodara, Rajkot, and major cities soon.",
    whereWaitlist: "Want NearDear in your city? Join our waitlist.",
    whereWaitlistLink: "Join waitlist →",

    teamLabel: "THE TEAM",
    teamBody:
      "NearDear was founded in Ahmedabad by people who have seen this gap personally. We are not building this from a pitch deck. We are building it from understanding — of what it means to age, to be far from the people you love, and to need someone near.",

    contactLabel: "GET IN TOUCH",
    contactEmail1: "hello@neardear.in",
    contactEmail2: "support@neardear.in",
    contactCity: "Ahmedabad, Gujarat, India",

    ctaLabel: "Find a NearDear →",
  },
  GU: {
    label: "નિયરડિયર વિશે",
    heading: "અમે આ વ્હાઇટબોર્ડ\nપરથી નથી બનાવ્યું.",
    subheading: "અમે આ સમજણ પરથી બનાવ્યું.",

    storyLabel: "સ્થાપનાનો વિચાર",
    storyBody: [
      "આપણે એક એવી શાંત કટોકટીમાંથી પસાર થઈ રહ્યા છીએ જેને કોઈ નામ નથી.",
      "બાળકો બેંગ્લોર, દુબઈ, ટોરોન્ટો જાય છે. માતા-પિતા અમદાવાદ, રાજકોટ, સુરતમાં રહે છે. સંયુક્ત પરિવારો વિખેરાઈ ગયા. ડૉક્ટરની મુલાકાત, દવા લેવી, શાંત મંગળવારની બપોર — આ બધું સંભાળનાર હવે તે જ શહેરમાં નથી.",
      "74 વર્ષની સ્ત્રીને ફાઇનાન્શિયલ એડવાઇઝરની જરૂર નથી. તેમને કોઈ સાથ બેસે, વાત કરે, અગર તે ઠીક ન લાગે તો ખ્યાલ રાખે — એ જોઈએ છે.",
      "નિયરડિયર એ ખાલી જગ્યા માટે અસ્તિત્વ ધરાવે છે.",
    ],

    whatLabel: "અમે શું છીએ",
    whatHeading: "ભારતનું પ્રથમ હ્યુમન-પ્રેઝન્સ માર્કેટપ્લેસ.",
    whatBody:
      "NearDear.in પરિવારોને ચકાસાયેલ, પ્રશિક્ષિત સાથીદારો સાથે જોડે છે — વૃદ્ધ સંભાળ, હૉસ્પિટલ વિઝિટ, ભાવનાત્મક સહારો, અને વધારે — અમદાવાદ અને ગાંધીનગરમાં.",
    whatNote:
      "અમે સ્ટાફિંગ એજન્સી નથી. અમે મેડિકલ સર્વિસ નથી. અમે માનવ જોડાણ બદલવા માટે નથી. અમે ઊલટું છીએ: એક એવું પ્લેટફૉર્મ જે માનવ જોડાણ માટે જગ્યા ધરાવે છે.",

    principleLabel: "સ્થાપના સિદ્ધાંત",
    principleQuestion:
      "અમારો દરેક નિર્ણય — દરેક ફીચર, દરેક નીતિ, કોડ — એક પ્રશ્ન સામે રાખવામાં આવે છે:",
    principleQuote:
      '"એવું પ્લેટફૉર્મ કઈ રીતે બનાવીએ જ્યાં સંવેદનશીલ લોકો મહત્તમ સુરક્ષા, ટ્રેસેબિલિટી, ગૌરવ, અને જવાબદારી સાથે માનવ મદદ મેળવી શકે?"',
    principles: [
      { word: "સુરક્ષા", desc: "જે મદદ માંગે, તેને ઈજા ન થાય." },
      {
        word: "ટ્રેસેબિલિટી",
        desc: "દરેક સત્ર ટ્રૅક. દરેક ચેક-ઇન ટાઇમ-સ્ટૅમ્પ. દરેક નોટ પરિવારને.",
      },
      { word: "ગૌરવ", desc: "મેળવનાર વ્યક્તિ ફક્ત 'કેસ' નથી — માણસ છે." },
      {
        word: "જવાબદારી",
        desc: "કંઈ ખોટું થાય ત્યારે સ્પષ્ટ જવાબ: કોણ જવાબદાર છે?",
      },
    ],

    verifyLabel: "દરેક સાથીદારની ચકાસણી કઈ રીતે",
    verifyIntro: "NearDear ની ચકાસણી ત્રણ સ્તરે થાય છે:",
    verifyX: {
      tag: "X — ઓળખ ચકાસણી",
      items: [
        "સરકારી સિસ્ટમ દ્વારા આધાર ચકાસણી",
        "લાઇવ સેલ્ફી ID સાથે મૅચ",
        "ઘરનું સરનામું ચકાસણી",
        "PCC (પૉલિસ ક્લિયરન્સ) — વાર્ષિક નવીકરણ",
      ],
    },
    verifyY: {
      tag: "Y — ચારિત્ર્ય ચકાસણી",
      items: [
        "બે અંગત સંદર્ભ — ફૅમિલી નહીં, સમુદાયના લોકો",
        "ટીમ સાથે વિડિઓ ઇન્ટર્વ્યૂ",
        "સહાનુભૂતિ, સંચાર, અને સીમાઓ — ત્રણેય તપાસ",
      ],
    },
    verifyZ: {
      tag: "Z — ચાલુ ઇન્ટેગ્રિટી",
      items: [
        "GPS ચેક-ઇન અને ચેક-આઉટ",
        "સત્ર-પછી-નોટ્સ",
        "દરેક મુલાકાત પછી પ્રતિભાવ",
        "વાર્ષિક ફરીથી ચકાસણી",
        "ચિંતા ફ્લૅગ હંમેશા ખુલ્લી",
      ],
    },
    verifyNote:
      "આ બધા પછી — હા, તમે હજી માણસો સાથે જ કામ કરો છો. પણ આ સિસ્ટમ ખરાબ વ્યવહારને ઘણો ખર્ચાળ અને દૃશ્યમાન બનાવે છે.",

    whereLabel: "ક્યાં સેવા",
    whereBody:
      "હાલ અમદાવાદ અને ગાંધીનગરમાં. ટૂંક સમયમાં સુરત, વડોદરા, રાજકોટ.",
    whereWaitlist: "NearDear તમારા શહેરમાં ઇચ્છો છો? વેઇટલિસ્ટ જોઇન કરો.",
    whereWaitlistLink: "વેઇટલિસ્ટ →",

    teamLabel: "ટીમ",
    teamBody:
      "NearDear ની સ્થાપના અમદાવાદમાં એ લોકોએ કરી જેમણે આ ખાલી જગ્યા ખુદ અનુભવી છે. અમે આ pitch deck થી નથી બનાવ્યું — અમે સમજણ પરથી બનાવ્યું.",

    contactLabel: "સંપર્ક",
    contactEmail1: "hello@neardear.in",
    contactEmail2: "support@neardear.in",
    contactCity: "અમદાવાદ, ગુજરાત, ભારત",

    ctaLabel: "NearDear શોધો →",
  },
  HI: {
    label: "NEARDEAR के बारे में",
    heading: "हमने यह व्हाइटबोर्ड\nसे नहीं बनाया।",
    subheading: "हमने यह समझ से बनाया।",

    storyLabel: "स्थापना की सोच",
    storyBody: [
      "हम एक शांत संकट से गुजर रहे हैं जिसका कोई नाम नहीं है।",
      "बच्चे बेंगलुरु, दुबई, टोरंटो चले जाते हैं। माता-पिता अहमदाबाद, राजकोट, सूरत में रहते हैं। संयुक्त परिवार बिखर गए। डॉक्टर के पास जाना, दवा लाना, शांत मंगलवार की दोपहर — यह सब संभालने वाला अब उसी शहर में नहीं है।",
      "74 साल की महिला को वित्तीय सलाहकार की जरूरत नहीं है। उन्हें कोई साथ बैठे, बात करे, अगर वे ठीक न लगें तो ध्यान रखे — यह चाहिए।",
      "NearDear उस खाली जगह के लिए है।",
    ],

    whatLabel: "हम क्या हैं",
    whatHeading: "भारत का पहला मानव-उपस्थिति बाज़ार।",
    whatBody:
      "NearDear.in परिवारों को सत्यापित, प्रशिक्षित साथियों से जोड़ता है — बुजुर्ग देखभाल, अस्पताल विज़िट, भावनात्मक सहारा, और अधिक — अहमदाबाद और गांधीनगर में।",
    whatNote:
      "हम स्टाफिंग एजेंसी नहीं हैं। हम मेडिकल सर्विस नहीं हैं। हम मानवीय संबंध बदलने के लिए नहीं हैं। हम इसके विपरीत हैं: एक ऐसा प्लेटफ़ॉर्म जो मानवीय संबंध के लिए जगह बनाए रखता है।",

    principleLabel: "स्थापना सिद्धांत",
    principleQuestion:
      "हमारा हर निर्णय — हर फीचर, हर नीति, हर कोड — एक सवाल के सामने रखा जाता है:",
    principleQuote:
      '"ऐसा प्लेटफ़ॉर्म कैसे बनाएं जहां कमज़ोर लोग अधिकतम सुरक्षा, ट्रेसेबिलिटी, गरिमा, और जवाबदेही के साथ मानवीय सहायता प्राप्त कर सकें?"',
    principles: [
      { word: "सुरक्षा", desc: "जो मदद मांगे, उसे नुकसान न हो।" },
      {
        word: "ट्रेसेबिलिटी",
        desc: "हर सत्र ट्रैक। हर चेक-इन टाइमस्टैंप। हर नोट परिवार को।",
      },
      { word: "गरिमा", desc: "सहायता पाने वाला व्यक्ति सिर्फ 'केस' नहीं — इंसान है।" },
      {
        word: "जवाबदेही",
        desc: "कुछ गलत हो तो स्पष्ट जवाब: कौन जिम्मेदार है?",
      },
    ],

    verifyLabel: "हर साथी का सत्यापन कैसे होता है",
    verifyIntro: "NearDear का सत्यापन तीन स्तरों पर होता है:",
    verifyX: {
      tag: "X — पहचान सत्यापन",
      items: [
        "सरकारी प्रणाली के माध्यम से आधार सत्यापन",
        "लाइव सेल्फी ID से मिलान",
        "आवासीय पता सत्यापन",
        "PCC (पुलिस क्लियरेंस) — वार्षिक नवीनीकरण",
      ],
    },
    verifyY: {
      tag: "Y — चरित्र सत्यापन",
      items: [
        "दो व्यक्तिगत संदर्भ — परिवार नहीं, समुदाय के लोग",
        "टीम के साथ वीडियो साक्षात्कार",
        "सहानुभूति, संचार, और सीमाएं — तीनों की जांच",
      ],
    },
    verifyZ: {
      tag: "Z — निरंतर ईमानदारी निगरानी",
      items: [
        "GPS चेक-इन और चेक-आउट",
        "सत्र-के-बाद नोट्स",
        "हर मुलाकात के बाद प्रतिक्रिया",
        "वार्षिक पुनः सत्यापन",
        "चिंता फ्लैग हमेशा खुला",
      ],
    },
    verifyNote:
      "इन सबके बाद — हां, आप अभी भी इंसानों के साथ काम कर रहे हैं। लेकिन यह प्रणाली बुरे व्यवहार को बहुत महंगा और दृश्यमान बनाती है।",

    whereLabel: "हम कहां काम करते हैं",
    whereBody:
      "अभी अहमदाबाद और गांधीनगर में। जल्द ही सूरत, वडोदरा, राजकोट।",
    whereWaitlist: "NearDear अपने शहर में चाहते हैं? वेटलिस्ट में शामिल हों।",
    whereWaitlistLink: "वेटलिस्ट →",

    teamLabel: "टीम",
    teamBody:
      "NearDear की स्थापना अहमदाबाद में उन लोगों ने की जिन्होंने यह खाली जगह खुद महसूस की है। हमने यह पिच डेक से नहीं बनाया — हमने समझ से बनाया।",

    contactLabel: "संपर्क करें",
    contactEmail1: "hello@neardear.in",
    contactEmail2: "support@neardear.in",
    contactCity: "अहमदाबाद, गुजरात, भारत",

    ctaLabel: "NearDear खोजें →",
  },
};

export default function AboutPage() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <>
      <Header />
      <main className="bg-[#FEF8F0] min-h-screen">
        {/* Hero */}
        <section className="bg-[#1C2B3A] text-white py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F0B429] mb-6">
              {copy.label}
            </p>
            <h1
              className="font-[family-name:var(--font-playfair)] font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              {copy.heading.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>
            <p
              className="font-[family-name:var(--font-playfair)] text-[#E8E0D8] italic"
              style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
            >
              {copy.subheading}
            </p>
          </div>
        </section>

        {/* The Story */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-8">
              {copy.storyLabel}
            </p>
            <div className="space-y-5">
              {copy.storyBody.map((para, i) => (
                <p
                  key={i}
                  className={`leading-relaxed ${
                    i === copy.storyBody.length - 1
                      ? "text-[#1C2B3A] font-semibold text-xl font-[family-name:var(--font-playfair)]"
                      : "text-[#374151] text-lg"
                  }`}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* What We Are */}
        <section className="bg-white py-20 px-4 border-y border-[#E8E0D8]">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-6">
              {copy.whatLabel}
            </p>
            <h2
              className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-6"
              style={{ fontSize: "clamp(24px, 3vw, 36px)" }}
            >
              {copy.whatHeading}
            </h2>
            <p className="text-[#374151] text-lg leading-relaxed mb-5">
              {copy.whatBody}
            </p>
            <p className="text-[#6B7280] text-base leading-relaxed italic">
              {copy.whatNote}
            </p>
          </div>
        </section>

        {/* Founding Principle — boxed in Teal */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-8">
              {copy.principleLabel}
            </p>
            <p className="text-[#374151] text-base mb-6">
              {copy.principleQuestion}
            </p>
            {/* The quote — boxed in teal */}
            <blockquote className="border-2 border-[#1A6B7A] rounded-2xl p-8 mb-10 bg-white">
              <p
                className="font-[family-name:var(--font-playfair)] font-semibold text-[#1C2B3A] leading-relaxed"
                style={{ fontSize: "clamp(18px, 2.5vw, 24px)" }}
              >
                {copy.principleQuote}
              </p>
            </blockquote>
            {/* Four words */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {copy.principles.map((p) => (
                <div
                  key={p.word}
                  className="bg-white rounded-xl p-5 border border-[#E8E0D8]"
                >
                  <p className="font-[family-name:var(--font-playfair)] font-bold text-[#1A6B7A] text-lg mb-2">
                    {p.word}
                  </p>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How We Verify — X Y Z cards */}
        <section className="bg-white py-20 px-4 border-y border-[#E8E0D8]">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-4">
              {copy.verifyLabel}
            </p>
            <p className="text-[#374151] text-base mb-10">{copy.verifyIntro}</p>
            <div className="space-y-4">
              {([copy.verifyX, copy.verifyY, copy.verifyZ] as typeof copy.verifyX[]).map(
                (v, idx) => {
                  const colors = [
                    { bg: "#1C2B3A", tag: "#F0B429" },
                    { bg: "#1A6B7A", tag: "#FEF8F0" },
                    { bg: "#4A8C6F", tag: "#FEF8F0" },
                  ];
                  const col = colors[idx];
                  return (
                    <div
                      key={v.tag}
                      className="rounded-2xl p-6 text-white"
                      style={{ backgroundColor: col.bg }}
                    >
                      <p
                        className="text-xs font-semibold tracking-widest uppercase mb-4"
                        style={{ color: col.tag }}
                      >
                        {v.tag}
                      </p>
                      <ul className="space-y-2">
                        {v.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-white/90">
                            <span className="mt-1 shrink-0">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
              )}
            </div>
            <p className="text-[#6B7280] text-sm leading-relaxed mt-8 italic">
              {copy.verifyNote}
            </p>
          </div>
        </section>

        {/* Where We Operate */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-6">
              {copy.whereLabel}
            </p>
            <p className="text-[#374151] text-lg leading-relaxed mb-6">
              {copy.whereBody}
            </p>
            <p className="text-[#6B7280] mb-4">{copy.whereWaitlist}</p>
            <Link
              href="/cities"
              className="inline-flex items-center text-[#E07B2F] font-medium hover:underline"
            >
              {copy.whereWaitlistLink}
            </Link>
          </div>
        </section>

        {/* Team */}
        <section className="bg-white py-20 px-4 border-t border-[#E8E0D8]">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-6">
              {copy.teamLabel}
            </p>
            <p className="text-[#374151] text-lg leading-relaxed">
              {copy.teamBody}
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-6">
              {copy.contactLabel}
            </p>
            <div className="space-y-2 text-[#374151] text-base mb-10">
              <p>
                <a href={`mailto:${copy.contactEmail1}`} className="hover:text-[#E07B2F] transition-colors">
                  {copy.contactEmail1}
                </a>
              </p>
              <p>
                <a href={`mailto:${copy.contactEmail2}`} className="hover:text-[#E07B2F] transition-colors">
                  {copy.contactEmail2}
                </a>
              </p>
              <p className="text-[#6B7280]">{copy.contactCity}</p>
            </div>
            <Link
              href="/request/new"
              className="inline-flex items-center px-8 py-4 bg-[#E07B2F] text-white rounded-full font-semibold text-base hover:opacity-90 transition-opacity"
            >
              {copy.ctaLabel}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
