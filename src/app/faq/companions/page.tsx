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
        q: "Who can become a NearDear companion?",
        a: "Anyone with a good heart, a verified identity, and the genuine capacity to show up. You do not need a degree. You need:\n• To be 18 years or older\n• To live in Ahmedabad or Gandhinagar (currently)\n• To have a clean police record\n• To be willing to undergo our verification process\n• To genuinely care about helping people\n\nHomemakers, retired professionals, nurses, students, young people with vehicles, retired bank officers — all are welcome. The barrier to entry is character, not credentials.",
      },
      {
        q: "What kind of people are joining NearDear?",
        a: "Homemakers with free mornings who want meaningful income. Retired bank officers, teachers, and government employees who want to stay active and contribute. Nurses finishing hospital shifts who want additional income with their clinical skills. Young people with vehicles and empathy who want flexible work with purpose. Self-help group members looking for organised income opportunities.",
      },
      {
        q: "Is NearDear like a staffing agency?",
        a: "No. NearDear is a platform, not an agency. You are an independent verified companion — not our employee. You set your own availability. You choose which requests to accept. You build your own client relationships through the platform. We provide the infrastructure, the matching, the payments, and the safety framework.",
      },
      {
        q: "Do I need to live in Ahmedabad or Gandhinagar?",
        a: "Yes, for now. We are Phase 1 and serving only these two cities. If you are in another city, please join our waitlist — we are expanding soon.",
      },
    ],
  },
  {
    id: "verification",
    title: "The Verification Process",
    items: [
      {
        q: "What does the verification process involve?",
        a: "Three stages:\n\nStage 1 — Identity (X): Aadhaar verification. Live selfie captured in-app. Address proof. Police Clearance Certificate. This takes 3–7 days to review.\n\nStage 2 — Character (Y): We call two personal references you provide. We then schedule a 20–30 minute video interview with our team. We look for warmth, empathy, communication, and clear understanding of scope and boundaries.\n\nStage 3 — Orientation: Six self-paced online modules covering what NearDear is, the people you will serve, the session protocol, our hard rules, how to flag concerns, and your earnings and growth path. A quiz and digital signature to complete.",
      },
      {
        q: "Why do you need a Police Clearance Certificate?",
        a: "Because our companions enter people's homes and sit with vulnerable individuals. A PCC confirms you have no criminal record. It is how families trust you before they know you. It is your professional credential — like a driver's licence for this work.",
      },
      {
        q: "How long does the full verification take?",
        a: "Typically 5–10 days from start to approval. The PCC is the longest step — if you do not have one yet, you can submit your application and upload the PCC when it is ready.",
      },
      {
        q: "What happens in the video interview?",
        a: "A 20–30 minute conversation with our team over Google Meet. We will ask why you want to do this work, how you would handle some simple scenarios, what you would do if offered a cash gift, and how you think about the people you will be serving. There are no trick questions. We are looking for genuine warmth and clear thinking.",
      },
    ],
  },
  {
    id: "earnings",
    title: "Earnings",
    items: [
      {
        q: "How much can I earn?",
        a: "Starting out (Level 0–1): 3–5 sessions per week → ₹3,000–8,000/month working 5–10 hours per week.\n\nEstablished (Level 2): 8–12 sessions per week → ₹12,000–20,000/month working 15–20 hours per week.\n\nSenior companion (Level 3): Day shifts + recurring care → ₹25,000–40,000/month full-time or near full-time.",
      },
      {
        q: "What percentage do I receive?",
        a: "80% of every session fee. Always. The platform retains 20%.\n\nExample:\nFamily pays ₹700 → You receive ₹560\nFamily pays ₹1,500 → You receive ₹1,200\nFamily pays ₹2,000 → You receive ₹1,600\n\nThis split is fixed. It will not change without 60 days written notice and your right to exit.",
      },
      {
        q: "When do I get paid?",
        a: "Within 48 hours of every completed session. Always.\n\nTimeline: Session completed → you submit note → family confirms (or auto-confirms in 24h) → your earning is released → admin processes transfer within 48 hours → money in your bank account.",
      },
      {
        q: "How does the money reach me?",
        a: "You add your bank account details in your profile. After each session is confirmed, your earnings accumulate in your wallet. You can request a withdrawal at any time. Transfers are processed within 48 hours via IMPS/NEFT directly to your bank.",
      },
      {
        q: "Can I earn more as I grow?",
        a: "Yes — in two ways.\n\nTrust Level progression: Higher trust level = higher-value services = more earning potential.\n\nPerformance recognition: Companions who consistently deliver excellent service may receive individual rate upgrades (from 80% to 82% or 85%), milestone bonuses (₹500 for your 50th session), and occasion bonuses (like Women's Day credits).",
      },
    ],
  },
  {
    id: "sessions",
    title: "How Sessions Work",
    items: [
      {
        q: "How do I receive requests?",
        a: "When a family submits a request matching your city, services, availability, and trust level — you receive a push notification and SMS: \"New request near you — Ready to serve?\" You have 3 hours to accept or decline.",
      },
      {
        q: "What if I am available right now?",
        a: "Turn on \"Available Now\" in your app. Families with urgent needs will see you immediately and requests will come through with a shorter response window. This is your way of saying: I am here, right now, if someone needs me.",
      },
      {
        q: "What do I do when I arrive for a session?",
        a: "Open the NearDear app and tap CHECK IN. This logs your GPS location and time, and immediately notifies the family. Do not skip this — it is how the family knows you have arrived and is the foundation of trust.",
      },
      {
        q: "What is the session note?",
        a: "After every session, before you close the check-out, you submit a brief structured note:\n• What you helped with today\n• How the person seemed\n• Any observation for the family\n• Any concern to flag\n\nThis note goes to the family immediately. It is the most important thing you do after the session itself. It is how the family knows what happened when they were not there.",
      },
      {
        q: "What if something goes wrong during a session?",
        a: "For medical emergencies: call 112 immediately. Then notify the platform through the emergency flag in the app. For other concerns: use the flag button in the app. Never handle a serious situation alone.",
      },
    ],
  },
  {
    id: "hard-rules",
    title: "The Hard Rules",
    items: [
      {
        q: "What are the hard rules I must follow?",
        a: "These seven rules are non-negotiable:\n\n1. No cash. Never accept cash payment. All payments through NearDear only. Cash acceptance = immediate suspension.\n\n2. No gifts. Politely decline any gift. Persistent gift-giving should be reported to admin.\n\n3. No financial information. Never ask for or accept bank details, passwords, or PINs from anyone.\n\n4. No outside contact. Never share your personal WhatsApp or phone number. All contact through NearDear platform only.\n\n5. Scope only. You provide presence, companionship, and errands. Not medical treatment. Not legal advice. Not financial guidance.\n\n6. Report, do not act. If you observe something concerning about the elder's health, report it through the platform. Do not act independently.\n\n7. No decisions. Never sign documents, give consent, or make decisions on behalf of the elder.",
      },
      {
        q: "Why are these rules so strict?",
        a: "Because you are sitting with someone's parent. Their family trusts you. The elder trusts you. These rules exist to protect the elder, to protect you, and to protect the integrity of every companion on this platform.",
      },
    ],
  },
  {
    id: "account",
    title: "Managing Your Account",
    items: [
      {
        q: "Can I pause my account if I am busy or travelling?",
        a: "Yes. You can pause for 1 week, 2 weeks, 1 month, or until you manually resume. While paused, no new requests will come to you. Your existing sessions, trust level, and earnings are unaffected.",
      },
      {
        q: "Can I choose which services I offer?",
        a: "Yes. During your application, you select the services you can genuinely provide. You can update this from your profile at any time. Offer only what you can truly deliver — it is better to do fewer things well.",
      },
      {
        q: "What is the Trust Level system and how do I move up?",
        a: "Trust levels reflect your verified experience and track record:\n\nLevel 0 → Level 1: 5 completed sessions + positive feedback\nLevel 1 → Level 2: 10 sessions + admin review\nLevel 2 → Level 3: 25 sessions + 6 months + senior review\n\nHigher levels unlock higher-value services — home visits, personal care, day shifts, live-in care. Your earnings grow significantly with each level.",
      },
      {
        q: "Can my trust level go down?",
        a: "Only for a conduct violation or significant performance issues. Your trust level is yours — earned honestly and protected firmly. We do not reduce it for small issues. Warnings are issued first. Demotion is a last step.",
      },
      {
        q: "What if I want to close my account?",
        a: "You can close your account at any time. Your pending earnings are paid within 7 days. Your session history and trust level are retained for 6 months in case you want to return. After 6 months, your data is anonymised.",
      },
    ],
  },
  {
    id: "healthcare",
    title: "For Healthcare Professionals",
    items: [
      {
        q: "I am a nurse. How does NearDear work for me?",
        a: "NearDear was designed with you in mind. Your clinical skills are exactly what many families desperately need — and are currently not getting reliably from agencies.\n\nYou can offer: personal care assistance (bed bath, dressing), medication management, bedridden elder care, day shift or night shift home care, and hospital guidance help.\n\nDepending on your shift at your hospital, you could take 2–4 assignments per week in your own neighbourhood and earn ₹8,000–15,000 additional income per month.",
      },
      {
        q: "Do I need to disclose my nursing qualification?",
        a: "Yes — and it benefits you. Companions with healthcare qualifications are matched first for healthcare requests. Families specifically looking for a trained nurse will see you at the top of their results. Your qualification is your advantage.",
      },
      {
        q: "Am I acting as a nurse on NearDear?",
        a: "You are acting as a NearDear companion with healthcare skills. You are not prescribing, diagnosing, or providing clinical treatment. You are assisting with care tasks as directed by the family and treating doctor. The scope is defined and clear.",
      },
    ],
  },
];

export default function FaqCompanionsPage() {
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
            <Link href="/faq" className="text-sm text-[#4A8C6F] hover:underline mb-4 inline-block">
              ← FAQ
            </Link>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#4A8C6F] mb-4">
              {isGu ? "FAQ — સાથીઓ" : isHi ? "FAQ — साथी" : "FAQ — COMPANIONS"}
            </p>
            <h1
              className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-6"
              style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
            >
              {isGu ? "જોડાવા વિશે સઘળું" : isHi ? "जुड़ने के बारे में सब कुछ" : "Everything you need to know about joining"}
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
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#E8E0D8] bg-[#FEF8F0] text-[#1C2B3A] placeholder-[#9CA3AF] text-sm outline-none focus:border-[#4A8C6F] transition-colors"
              />
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-12 flex gap-8">
          {/* Sticky sidebar — desktop only */}
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
                          className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#F0FAF4] transition-colors"
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
            <div className="mt-16 bg-[#4A8C6F] rounded-2xl p-8 text-white text-center">
              <p
                className="font-[family-name:var(--font-playfair)] font-bold text-2xl mb-2"
              >
                Ready to join?
              </p>
              <p className="text-white/80 text-sm mb-6">
                Start your application today. Verification takes 5–10 days.
              </p>
              <Link
                href="/provider/apply"
                className="inline-flex items-center px-8 py-4 bg-white text-[#4A8C6F] rounded-full font-bold text-base hover:opacity-90 transition-opacity"
              >
                Start Your Application →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
