"use client";

import { useLanguage } from "@/lib/language";
import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";

const columns = {
  EN: [
    {
      title: "For Families & Elders",
      links: [
        { label: "Find a Companion", href: "/request/new" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Service Catalogue", href: "/services" },
        { label: "NRI Family Support", href: "#nri" },
        { label: "Elder Profile Setup", href: "/elder/new" },
      ],
    },
    {
      title: "For Companions",
      links: [
        { label: "Become a Companion", href: "/apply" },
        { label: "See What You Earn", href: "#earnings" },
        { label: "Verification Process", href: "/safety" },
        { label: "Trust Level System", href: "/trust" },
        { label: "Team Operator Info", href: "/team" },
      ],
    },
    {
      title: "Platform",
      links: [
        { label: "About", href: "/about" },
        { label: "Our Mission", href: "/mission" },
        { label: "Safety", href: "/safety" },
        { label: "Contact", href: "/contact" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms", href: "/terms" },
        { label: "Privacy", href: "/privacy" },
        { label: "Abuse Policy", href: "/abuse-policy" },
        { label: "Disclaimer", href: "/disclaimer" },
        { label: "Grievance", href: "/grievance" },
      ],
    },
  ],
  GU: [
    {
      title: "પરિવાર અને વડીલો માટે",
      links: [
        { label: "સાથી શોધો", href: "/request/new" },
        { label: "કેવી રીતે કામ કરે", href: "#how-it-works" },
        { label: "સેવા સૂચિ", href: "/services" },
        { label: "વિદેશ NRI સહાય", href: "#nri" },
        { label: "વડીલ પ્રોફાઈલ", href: "/elder/new" },
      ],
    },
    {
      title: "સાથીઓ માટે",
      links: [
        { label: "સાથી બનો", href: "/apply" },
        { label: "કમાણી જુઓ", href: "#earnings" },
        { label: "ચકાસણી પ્રક્રિયા", href: "/safety" },
        { label: "વિશ્વાસ સ્તર", href: "/trust" },
        { label: "ટીમ ઓપરેટર", href: "/team" },
      ],
    },
    {
      title: "પ્લેટફોર્મ",
      links: [
        { label: "અમારા વિશે", href: "/about" },
        { label: "અમારું ધ્યેય", href: "/mission" },
        { label: "સુરક્ષા", href: "/safety" },
        { label: "સંપર્ક", href: "/contact" },
        { label: "કારકિર્દી", href: "/careers" },
      ],
    },
    {
      title: "કાનૂની",
      links: [
        { label: "નિયમો", href: "/terms" },
        { label: "ગોપનીયતા", href: "/privacy" },
        { label: "દુરુપયોગ નીતિ", href: "/abuse-policy" },
        { label: "અસ્વીકૃતિ", href: "/disclaimer" },
        { label: "ફરિયાદ", href: "/grievance" },
      ],
    },
  ],
  HI: [
    {
      title: "परिवार और बुजुर्गों के लिए",
      links: [
        { label: "साथी खोजें", href: "/request/new" },
        { label: "यह कैसे काम करता है", href: "#how-it-works" },
        { label: "सेवा सूची", href: "/services" },
        { label: "NRI परिवार सहायता", href: "#nri" },
        { label: "बुजुर्ग प्रोफाइल", href: "/elder/new" },
      ],
    },
    {
      title: "साथियों के लिए",
      links: [
        { label: "साथी बनें", href: "/apply" },
        { label: "कमाई देखें", href: "#earnings" },
        { label: "सत्यापन प्रक्रिया", href: "/safety" },
        { label: "विश्वास स्तर", href: "/trust" },
        { label: "टीम ऑपरेटर", href: "/team" },
      ],
    },
    {
      title: "प्लेटफ़ॉर्म",
      links: [
        { label: "हमारे बारे में", href: "/about" },
        { label: "हमारा मिशन", href: "/mission" },
        { label: "सुरक्षा", href: "/safety" },
        { label: "संपर्क", href: "/contact" },
        { label: "करियर", href: "/careers" },
      ],
    },
    {
      title: "कानूनी",
      links: [
        { label: "नियम", href: "/terms" },
        { label: "गोपनीयता", href: "/privacy" },
        { label: "दुरुपयोग नीति", href: "/abuse-policy" },
        { label: "अस्वीकरण", href: "/disclaimer" },
        { label: "शिकायत", href: "/grievance" },
      ],
    },
  ],
};

const t = {
  EN: {
    tagline: "Someone near. Someone dear.",
    copyright: "© 2026 NearDear.in | Made with purpose in India",
    disclaimer:
      "All companions are independently verified individuals, not employees of NearDear.",
    cols: columns.EN,
  },
  GU: {
    tagline: "કોઈ નજીક. કોઈ પ્રિય.",
    copyright: "© 2026 NearDear.in | ભારતમાં ઉદ્દેશ સાથે બનાવ્યું",
    disclaimer:
      "બધા સાથીઓ સ્વતંત્ર રીતે ચકાસાયેલ વ્યક્તિઓ છે, NearDear ના કર્મચારીઓ નથી.",
    cols: columns.GU,
  },
  HI: {
    tagline: "कोई पास। कोई प्रिय।",
    copyright: "© 2026 NearDear.in | भारत में उद्देश्य के साथ बनाया",
    disclaimer:
      "सभी साथी स्वतंत्र रूप से सत्यापित व्यक्ति हैं, NearDear के कर्मचारी नहीं।",
    cols: columns.HI,
  },
};

export default function Footer() {
  const { lang } = useLanguage();
  const copy = t[lang];

  return (
    <footer className="bg-[#1C2B3A] text-white pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Brand */}
        <div className="mb-12">
          <p
            className="font-[family-name:var(--font-playfair)] font-bold text-[#E07B2F]"
            style={{ fontSize: "36px" }}
          >
            NearDear
          </p>
          <p className="text-white/60 text-sm mt-1">{copy.tagline}</p>
        </div>

        {/* Four columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {copy.cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/50 text-sm hover:text-white/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <p className="text-white/40 text-xs">{copy.copyright}</p>
          </div>
          <p className="text-white/30 text-xs text-center md:text-right max-w-sm">
            {copy.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
