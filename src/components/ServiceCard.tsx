"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language";

export interface ServiceData {
  id: string;
  name: string;
  slug: string;
  cluster: string;
  mode: string;
  descriptionProvider: string;
  descriptionReceiver: string;
  minTrustLevel: string;
  suggestedFeeMin: number;
  suggestedFeeMax: number;
  requiresVehicle: boolean;
}

interface ServiceCardProps {
  service: ServiceData;
  isOpen: boolean;
  onToggle: () => void;
  userRole: string | null; // null = not logged in
}

const clusterColors: Record<string, { bg: string; text: string }> = {
  PRESENCE: { bg: "#4A8C6F", text: "#ffffff" },
  NAVIGATION: { bg: "#1A6B7A", text: "#ffffff" },
  CONTINUITY: { bg: "#F0B429", text: "#1C2B3A" },
  CONNECTION: { bg: "#8B7EC8", text: "#ffffff" },
  PROFESSIONAL_ADVISORY: { bg: "#8B7EC8", text: "#ffffff" },
};

const clusterLabels: Record<string, { EN: string; GU: string }> = {
  PRESENCE: { EN: "Presence", GU: "ઉપસ્થિતિ" },
  NAVIGATION: { EN: "Navigation", GU: "નેવિગેશન" },
  CONTINUITY: { EN: "Continuity", GU: "સાતત્ય" },
  CONNECTION: { EN: "Connection", GU: "સંપર્ક" },
  PROFESSIONAL_ADVISORY: { EN: "Advisory", GU: "સલાહ" },
};

const clusterHooks: Record<string, { EN: string; GU: string }> = {
  PRESENCE: {
    EN: "For families who cannot always be there.",
    GU: "એવા પરિવારો માટે જે હંમેશા ત્યાં ન હોઈ શકે.",
  },
  NAVIGATION: {
    EN: "For elders navigating systems that were not designed for them.",
    GU: "એવા વડીલો માટે જે તેમના માટે ન બનેલી વ્યવસ્થામાં રાહ શોધે છે.",
  },
  CONTINUITY: {
    EN: "For the daily things that keep life running smoothly.",
    GU: "દૈનિક કામો માટે જે જીવન સરળ રાખે છે.",
  },
  CONNECTION: {
    EN: "For the moments when presence matters more than words.",
    GU: "એ ક્ષણો માટે જ્યારે હાજરી શબ્દો કરતાં વધારે મહત્ત્વની હોય.",
  },
  PROFESSIONAL_ADVISORY: {
    EN: "For guidance when expertise and trust both matter.",
    GU: "જ્યારે નિષ્ણાતતા અને વિશ્વાસ બંને જરૂરી હોય ત્યારે.",
  },
};

const trustLabels: Record<string, { EN: string; GU: string }> = {
  LEVEL_0: { EN: "Remote sessions", GU: "રિમોટ સત્ર" },
  LEVEL_1: { EN: "Verified companion", GU: "ચકાસાયેલ સાથી" },
  LEVEL_2: { EN: "Home visits", GU: "ઘરની મુલાકાત" },
  LEVEL_3: { EN: "Senior companion only", GU: "વરિષ્ઠ સાથી" },
};

const modeLabels: Record<string, { EN: string; GU: string }> = {
  IN_PERSON: { EN: "📍 In-person", GU: "📍 રૂબરૂ" },
  REMOTE: { EN: "💻 Remote (voice/video)", GU: "💻 રિમોટ (અવાજ/વિડિયો)" },
  BOTH: { EN: "📍 In-person or 💻 Remote", GU: "📍 રૂબરૂ અથવા 💻 રિમોટ" },
};

const ui = {
  EN: {
    from: "from",
    fee: (min: number, max: number) => `₹${min} – ₹${max} per visit`,
    trustLabel: "🔒",
    vehicle: "🚗 Vehicle helpful",
    book: "I need this service",
    offer: "I can offer this",
    bookSelf: "Book this service",
    offerSelf: "I offer this service →",
    earnLabel: (pct: number) => `Companion earns ${pct}%`,
  },
  GU: {
    from: "થી",
    fee: (min: number, max: number) => `₹${min} – ₹${max} પ્રતિ મુલાકાત`,
    trustLabel: "🔒",
    vehicle: "🚗 વાહન ઉપયોગી",
    book: "મને આ સેવા જોઈએ",
    offer: "હું આ આપી શકું",
    bookSelf: "આ સેવા બુક કરો",
    offerSelf: "હું આ ઓફર કરું છું →",
    earnLabel: (pct: number) => `સાથી ${pct}% કમાય`,
  },
  HI: {
    from: "से",
    fee: (min: number, max: number) => `₹${min} – ₹${max} प्रति विजिट`,
    trustLabel: "🔒",
    vehicle: "🚗 वाहन सहायक",
    book: "मुझे यह सेवा चाहिए",
    offer: "मैं यह दे सकता हूँ",
    bookSelf: "यह सेवा बुक करें",
    offerSelf: "मैं यह प्रदान करता हूँ →",
    earnLabel: (pct: number) => `साथी ${pct}% कमाता है`,
  },
};

export default function ServiceCard({
  service,
  isOpen,
  onToggle,
  userRole,
}: ServiceCardProps) {
  const { lang } = useLanguage();
  const copy = ui[lang];
  const bodyRef = useRef<HTMLDivElement>(null);

  const colors = clusterColors[service.cluster] ?? clusterColors["PRESENCE"];
  const clusterLabel =
    (clusterLabels[service.cluster]?.[lang === "HI" ? "EN" : lang]) ??
    service.cluster;
  const hook =
    clusterHooks[service.cluster]?.[lang === "HI" ? "EN" : lang] ?? "";
  const trustText =
    trustLabels[service.minTrustLevel]?.[lang === "HI" ? "EN" : lang] ??
    service.minTrustLevel;
  const modeText =
    modeLabels[service.mode]?.[lang === "HI" ? "EN" : lang] ?? service.mode;

  // Estimate expanded height for smooth transition
  const expandedHeight = "640px";

  return (
    <div
      className="bg-white rounded-xl border border-[#E8E0D8] cursor-pointer select-none"
      style={{
        transition: "box-shadow 200ms ease, transform 200ms ease",
        boxShadow: isOpen
          ? "0 8px 32px rgba(28,43,58,0.12)"
          : "0 1px 3px rgba(28,43,58,0.06)",
        transform: isOpen ? "none" : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isOpen)
          (e.currentTarget as HTMLDivElement).style.transform =
            "translateY(-2px)";
        if (!isOpen)
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 4px 12px rgba(28,43,58,0.10)";
      }}
      onMouseLeave={(e) => {
        if (!isOpen) {
          (e.currentTarget as HTMLDivElement).style.transform = "none";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 1px 3px rgba(28,43,58,0.06)";
        }
      }}
      onClick={onToggle}
    >
      {/* Closed header — always visible */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-[#1C2B3A] text-sm leading-snug">
            {service.name}
          </p>
          {isOpen && (
            <button
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="text-[#9CA3AF] hover:text-[#1C2B3A] transition-colors text-lg leading-none shrink-0 mt-[-2px]"
            >
              ×
            </button>
          )}
        </div>
        <span
          className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-2 mb-2"
          style={{ backgroundColor: colors.bg, color: colors.text }}
        >
          {clusterLabel}
        </span>
        <p
          className="font-[family-name:var(--font-dm-mono)] text-sm"
          style={{ color: "#F0B429" }}
        >
          {copy.from} ₹{service.suggestedFeeMin}
        </p>
      </div>

      {/* Expanded body */}
      <div
        ref={bodyRef}
        style={{
          maxHeight: isOpen ? expandedHeight : "0",
          overflow: "hidden",
          transition: "max-height 350ms ease-in-out",
        }}
        aria-hidden={!isOpen}
      >
        <div
          style={{
            opacity: isOpen ? 1 : 0,
            transition: isOpen
              ? "opacity 200ms ease-in-out 150ms"
              : "opacity 100ms ease-in-out",
          }}
        >
          <div
            className="px-4 pb-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-t border-[#E8E0D8] pt-4">
              {/* Hook line */}
              {hook && (
                <p className="text-xs text-[#6B7280] italic mb-3">{hook}</p>
              )}

              {/* Main description */}
              <p className="text-sm text-[#1C2B3A] leading-relaxed mb-4">
                {service.descriptionReceiver}
              </p>

              {/* Meta row */}
              <div className="flex flex-col gap-1.5 mb-4">
                <span className="text-xs text-[#6B7280] flex items-center gap-1.5">
                  {modeText}
                </span>
                <span className="text-xs text-[#6B7280] flex items-center gap-1.5">
                  {copy.trustLabel}{" "}
                  <span
                    className="inline-block px-1.5 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: "#EEF2FF", color: "#1A6B7A" }}
                  >
                    {trustText}
                  </span>
                </span>
                {service.requiresVehicle && (
                  <span className="text-xs text-[#6B7280]">
                    {copy.vehicle}
                  </span>
                )}
              </div>

              {/* Fee */}
              <div className="mb-4">
                <p
                  className="font-[family-name:var(--font-dm-mono)] text-base font-medium"
                  style={{ color: "#1C2B3A" }}
                >
                  {copy.fee(service.suggestedFeeMin, service.suggestedFeeMax)}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">
                  {copy.earnLabel(80)}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2">
                {/* Not logged in */}
                {!userRole && (
                  <>
                    <Link
                      href={`/request?service=${service.slug}`}
                      className="block text-center text-sm font-semibold text-white rounded-lg px-4 py-2.5"
                      style={{ backgroundColor: "#E07B2F" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {copy.book}
                    </Link>
                    <Link
                      href="/provider/apply"
                      className="block text-center text-sm font-semibold rounded-lg px-4 py-2"
                      style={{ color: "#4A8C6F" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {copy.offer} →
                    </Link>
                  </>
                )}

                {/* Logged in as RECEIVER */}
                {userRole === "RECEIVER" && (
                  <Link
                    href={`/request?service=${service.slug}`}
                    className="block text-center text-sm font-semibold text-white rounded-lg px-4 py-2.5"
                    style={{ backgroundColor: "#E07B2F" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {copy.bookSelf}
                  </Link>
                )}

                {/* Logged in as COMPANION / PROVIDER */}
                {(userRole === "COMPANION" || userRole === "PROVIDER") && (
                  <Link
                    href="/provider/profile"
                    className="block text-center text-sm font-semibold rounded-lg px-4 py-2"
                    style={{ color: "#4A8C6F" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {copy.offerSelf}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
