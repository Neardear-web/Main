"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Header from "@/components/hero/Header";
import Footer from "@/components/hero/Footer";
import { useLanguage } from "@/lib/language";

interface FaqItem { q: string; a: string }
interface FaqSection { id: string; title: string; items: FaqItem[] }

const SECTIONS: FaqSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        q: "What is NearDear?",
        a: "NearDear is a platform that connects families with verified, trained companions who provide real human help for elders and others who need support. Think of us as the trustworthy, accountable alternative to a staffing agency — except every companion is named, verified, GPS-tracked, and reviewed after every visit.",
      },
      {
        q: "Who is NearDear for?",
        a: "NearDear is for families whose parents live in a different city or country; elders who need help with daily care but want to remain at home; working families who need reliable daytime or nighttime care support; anyone going through a difficult time who needs a calm human presence; and students who have just arrived in a new city and need local support.",
      },
      {
        q: "Is NearDear available in my city?",
        a: "We currently serve Ahmedabad and Gandhinagar. We are expanding to Surat, Vadodara, Rajkot, Mumbai, and Bengaluru soon. If your city is not yet active, you can join our waitlist and we will notify you when we launch there.",
      },
      {
        q: "Is NearDear a medical service?",
        a: "No. NearDear companions are not registered medical professionals acting in a clinical capacity. They are trained, verified individuals who assist with daily care tasks as directed by the family. For medical decisions or emergencies, always contact a qualified doctor or call 112.",
      },
    ],
  },
  {
    id: "finding-companion",
    title: "Finding a Companion",
    items: [
      {
        q: "How does the matching work?",
        a: "You describe what you need in your own words. Our AI reads your request, understands the situation, and finds the best-matched companions in your elder's city based on skills, experience, language, availability, and your specific care needs. You see real profiles — names, photos, occupations, trust levels, and sessions completed — and choose who to request.",
      },
      {
        q: "Can I choose a female companion?",
        a: "Yes. When setting up your elder's profile, you can specify a preference for a female or male companion. For home visits and personal care, many families prefer a female companion. We honour this preference as a hard filter — you will only see companions who match your preference.",
      },
      {
        q: "What if no companion is available?",
        a: "If no companion is immediately available in your area, we show you a \"Notify me\" option. We will contact you as soon as a companion is available. For urgent needs, our SOS feature connects you to any available companion in real time.",
      },
      {
        q: "Can I meet the companion before the first visit?",
        a: "Yes. After a companion accepts your request, you can schedule a short intro video call through the platform before the first home visit. This is free and helps build trust before the session begins.",
      },
      {
        q: "Can I request the same companion every week?",
        a: "Yes. You can set up a recurring plan with the same companion — same days, same time, every week or month. After a few sessions, if you are happy, we make it easy to lock in that relationship.",
      },
    ],
  },
  {
    id: "about-companions",
    title: "About Companions",
    items: [
      {
        q: "How are companions verified?",
        a: "Every companion goes through three layers of verification before their first session:\n\nX — Identity: Aadhaar verified through government API. Live selfie matched to ID. Address verified. Police Clearance Certificate reviewed.\n\nY — Character: Two personal references called by our team. Structured video interview assessing empathy, communication, and boundaries.\n\nZ — Ongoing: GPS check-in and check-out on every visit. Post-session note reviewed. Family feedback after every session. Annual re-verification.",
      },
      {
        q: "What is a Trust Level?",
        a: "Every companion earns a Trust Level based on their verification, session history, and feedback:\n• Level 0 — Remote sessions only (calls, video)\n• Level 1 — Field verified (public places, errands)\n• Level 2 — Home Trusted (home visits, elder care)\n• Level 3 — Senior Companion (live-in, ongoing care)\n\nHigher trust levels unlock higher-value services. You will always see a companion's trust level clearly on their profile.",
      },
      {
        q: "What if I am not happy with my companion?",
        a: "You can terminate any companion at any time — no explanation required. Simply tap the terminate button in your dashboard. If you have a concern, you can flag it and our admin team will review it within 24 hours.",
      },
      {
        q: "Can the companion make medical decisions for my parent?",
        a: "No. A companion follows the family's instructions and the treating doctor's written prescription. They never make independent medical decisions, never advise on medication changes, and never act beyond the scope of what the family has asked for.",
      },
    ],
  },
  {
    id: "sessions",
    title: "Sessions and Visits",
    items: [
      {
        q: "What happens during a session?",
        a: "When the companion arrives, they check in on the app — you receive a notification with the exact time. After the session, they check out and submit a structured note covering what they did, how your elder seemed, any observation worth sharing, and any concern if applicable. You receive this note immediately.",
      },
      {
        q: "Will I know exactly when the companion arrives?",
        a: "Yes. The moment the companion checks in at your elder's location, you receive a push notification and SMS: \"[Name] has arrived. Session started at [time].\" You are always informed — even from the other side of the world.",
      },
      {
        q: "What if the companion does not arrive?",
        a: "If a companion does not arrive, contact us immediately. We will find a replacement urgently and issue a full refund for that session. A no-show by a companion is treated as a serious conduct issue on our platform.",
      },
      {
        q: "Can the companion stay overnight?",
        a: "Yes, for senior companions with Level 3 trust. Night shift and live-in care is available for companions who have completed our highest level of verification and have significant care experience.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments and Refunds",
    items: [
      {
        q: "How much does it cost?",
        a: "Fees vary by service type and city. Basic elder visits start from ₹500. Personal care and hospital guidance from ₹600–1,000. Day shifts from ₹1,500. All prices are shown clearly before you book. There are no hidden charges.",
      },
      {
        q: "Is the payment secure?",
        a: "All payments are processed through Razorpay, one of India's most trusted payment gateways. We support UPI, cards, net banking, and wallets. Your payment is held securely until the session is completed.",
      },
      {
        q: "What is the cancellation and refund policy?",
        a: "Before payment: Free cancellation always\n48+ hours before session: Full refund\n24–48 hours before: 75% refund\nUnder 24 hours: 50% refund\nSame day: No refund (companion compensated)\nCompanion no-show: Full refund always",
      },
      {
        q: "What if I am not satisfied with the session?",
        a: "You can flag a concern within 24 hours of receiving the session note. Our admin team reviews all concerns within 24–48 hours, contacts both parties, and makes a fair decision. If the session was not delivered as expected, a full or partial refund is processed.",
      },
    ],
  },
  {
    id: "elder-care",
    title: "Elder Care Specifically",
    items: [
      {
        q: "My parent is bedridden. Can NearDear help?",
        a: "Yes. We have companions with clinical training — nurses, ANMs, home care trained individuals — who are experienced with bedridden elder care including bed baths, diaper changes, feeding, patient positioning, and medication dispensing. When you submit your request, describe your parent's condition and we will match you with someone appropriately trained.",
      },
      {
        q: "We currently use an agency. Why should we switch to NearDear?",
        a: "With an agency: you do not know who is coming, no accountability for quality, no visibility into what happened, no tracking or notes.\n\nWith NearDear: you know exactly who is coming — their name, photo, background. GPS check-in and check-out on every visit. Structured visit note after every session. Feedback collected and reviewed. Any companion can be terminated instantly. The platform holds everyone accountable.\n\nSame service. More trust. More visibility. More dignity.",
      },
      {
        q: "Can NearDear replace a full-time agency arrangement?",
        a: "Yes. Our live-in and day shift care companions can provide the same continuity that an agency provides — but with full transparency, verified identities, and a platform that holds everyone accountable. Many families find NearDear more reliable and more trustworthy than traditional agencies.",
      },
    ],
  },
  {
    id: "safety",
    title: "Safety and Privacy",
    items: [
      {
        q: "Is my elder's information safe?",
        a: "Yes. All data is encrypted. Your elder's address and personal details are only shared with the matched companion, and only after you confirm the request. Our platform never shares data with third parties.",
      },
      {
        q: "What if my elder is uncomfortable with the companion?",
        a: "Your elder can signal discomfort through a simple private button in the app — this triggers an admin review without any confrontation. You can also terminate the companion from your dashboard at any time.",
      },
      {
        q: "What happens in a genuine emergency during a session?",
        a: "The companion is trained to call 112 immediately in any medical emergency, then notify the platform. They do not attempt to treat or diagnose — they call for help and stay present until help arrives.",
      },
    ],
  },
];

export default function FaqFamiliesPage() {
  const { lang } = useLanguage();
  const isGu = lang === "GU";
  const isHi = lang === "HI";

  const [openId, setOpenId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return SECTIONS;
    const q = search.toLowerCase();
    return SECTIONS.map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (item) =>
          item.q.toLowerCase().includes(q) ||
          item.a.toLowerCase().includes(q)
      ),
    })).filter((sec) => sec.items.length > 0);
  }, [search]);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <>
      <Header />
      <main className="bg-[#FEF8F0] min-h-screen">
        {/* Header */}
        <section className="py-16 px-4 border-b border-[#E8E0D8] bg-white">
          <div className="max-w-3xl mx-auto">
            <Link href="/faq" className="text-sm text-[#1A6B7A] hover:underline mb-4 inline-block">
              ← FAQ
            </Link>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#1A6B7A] mb-4">
              {isGu ? "FAQ — પરિવાર અને વડીલો" : isHi ? "FAQ — परिवार और बुजुर्ग" : "FAQ — FAMILIES & ELDERS"}
            </p>
            <h1
              className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-6"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              {isGu ? "તમારે જાણવું જોઈએ તે બધું" : isHi ? "वह सब जो आपको जानना चाहिए" : "Everything you need to know"}
            </h1>
            {/* Search */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-lg">
                🔍
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isGu ? "પ્રશ્ન શોધો..." : isHi ? "अपना प्रश्न खोजें…" : "Search your question…"}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#E8E0D8] bg-[#FEF8F0] text-[#1C2B3A] placeholder-[#9CA3AF] text-sm outline-none focus:border-[#E07B2F] transition-colors"
              />
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 flex gap-8">
          {/* Sticky sidebar nav — desktop only */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24 space-y-1">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#9CA3AF] mb-3 px-3">
                Sections
              </p>
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block px-3 py-2 rounded-lg text-sm text-[#6B7280] hover:text-[#1C2B3A] hover:bg-white transition-colors"
                >
                  {sec.title}
                </a>
              ))}
            </div>
          </aside>

          {/* Accordion content */}
          <div className="flex-1 min-w-0 space-y-8">
            {filtered.length === 0 && (
              <div className="text-center py-16 text-[#9CA3AF]">
                <p className="text-lg mb-2">No results found.</p>
                <p className="text-sm">Try a different search term.</p>
              </div>
            )}
            {filtered.map((sec) => (
              <div key={sec.id} id={sec.id}>
                <h2 className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] text-xl mb-4 pb-2 border-b border-[#E8E0D8]">
                  {sec.title}
                </h2>
                <div className="space-y-2">
                  {sec.items.map((item, idx) => {
                    const id = `${sec.id}-${idx}`;
                    const isOpen = openId === id;
                    return (
                      <div
                        key={id}
                        className="bg-white rounded-xl border border-[#E8E0D8] overflow-hidden"
                      >
                        <button
                          onClick={() => toggle(id)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#FEF8F0] transition-colors"
                        >
                          <span className="font-medium text-[#1C2B3A] text-sm leading-snug">
                            {item.q}
                          </span>
                          <span
                            className="shrink-0 text-[#9CA3AF] transition-transform duration-200"
                            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
                          >
                            ✕
                          </span>
                        </button>
                        <div
                          style={{
                            maxHeight: isOpen ? "1000px" : "0",
                            overflow: "hidden",
                            transition: "max-height 0.3s ease",
                          }}
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-[#F3F4F6]">
                            {item.a.split("\n").map((line, i) => (
                              <p
                                key={i}
                                className={`text-sm leading-relaxed text-[#374151] ${i > 0 ? "mt-2" : ""}`}
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Bottom CTA */}
            <div className="mt-16 bg-white rounded-2xl border border-[#E8E0D8] p-8 text-center">
              <p className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] text-xl mb-2">
                Still have a question?
              </p>
              <p className="text-[#6B7280] text-sm mb-6">
                Our team is happy to help directly.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <a
                  href="https://wa.me/917600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#25D366" }}
                >
                  💬 WhatsApp us
                </a>
                <a
                  href="mailto:hello@neardear.in"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm border-2 hover:opacity-80 transition-opacity"
                  style={{ borderColor: "#1A6B7A", color: "#1A6B7A" }}
                >
                  ✉️ Email us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
