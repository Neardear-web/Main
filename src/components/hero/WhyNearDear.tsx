"use client";

import { useLanguage } from "@/lib/language";

const t = {
  EN: {
    label: "WHY NEARDEAR EXISTS",
    heading: "In the era of AI, someone human\nwill still be there for you.",
    para1:
      "Children migrate to Bengaluru, Dubai, Toronto. Parents stay behind in Rajkot, Ahmedabad, Patna. Joint families dissolve. The person who used to handle the doctor visit, the medicine refill, the quiet Tuesday afternoon — is no longer nearby.",
    para2:
      "NearDear exists for that gap. Not to replace family. To hold the space until family can be there.",
  },
  GU: {
    label: "નિયરડિયર શા માટે અસ્તિત્વ ધરાવે છે",
    heading: "AI ના યુગમાં પણ, કોઈ\nમાણસ તમારી સાથે હશે.",
    para1:
      "બાળકો બેંગ્લોર, દુબઈ, ટોરોન્ટો જાય છે. માતા-પિતા રાજકોટ, અમદાવાદ, પટણામાં રહે છે. સંયુક્ત પરિવારો વિખેરાઈ ગયા. ડૉક્ટરની મુલાકાત, દવા લેવી, શાંત મંગળવારની બપોર — આ બધું સંભાળનાર હવે નજીક નથી.",
    para2:
      "નિયરડિયર એ ખાલી જગ્યા માટે અસ્તિત્વ ધરાવે છે. પરિવારની જગ્યા લેવા નહીં. જ્યાં સુધી પરિવાર ન આવી શકે ત્યાં સુધી એ જગ્યા સંભાળવા.",
  },
  HI: {
    label: "NearDear क्यों अस्तित्व में है",
    heading: "AI के युग में भी, कोई\nइंसान आपके लिए रहेगा।",
    para1:
      "बच्चे बेंगलुरु, दुबई, टोरंटो चले जाते हैं। माता-पिता राजकोट, अहमदाबाद, पटना में रहते हैं। संयुक्त परिवार बिखर गए। डॉक्टर के पास जाना, दवा लाना, शांत मंगलवार की दोपहर — यह सब संभालने वाला अब पास नहीं है।",
    para2:
      "NearDear उस खाली जगह के लिए है। परिवार की जगह लेने के लिए नहीं। जब तक परिवार न आ सके तब तक उस जगह को संभालने के लिए।",
  },
};

export default function WhyNearDear() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <section className="bg-[#FEF8F0] py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-6">
          {copy.label}
        </p>
        <h2
          className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] leading-tight mb-8"
          style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}
        >
          {copy.heading.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i === 0 && <br />}
            </span>
          ))}
        </h2>
        <p className="text-[#6B7280] text-lg leading-relaxed mb-6">
          {copy.para1}
        </p>
        <p className="text-[#6B7280] text-lg leading-relaxed">{copy.para2}</p>
      </div>
    </section>
  );
}
