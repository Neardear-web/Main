"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/lib/language";
import ServiceCard, { ServiceData } from "@/components/ServiceCard";

const t = {
  EN: {
    heading: "Care for every situation",
    subheading: "Click any service to learn more and find a companion near you.",
    cta: "See all services and fees",
    loading: "Loading services...",
    error: "Could not load services.",
  },
  GU: {
    heading: "દરેક પરિસ્થિતિ માટે સંભાળ",
    subheading: "વધુ જાણવા અને નજીકનો સાથી શોધવા કોઈ પણ સેવા પર ક્લિક કરો.",
    cta: "બધી સેવાઓ અને ફી જુઓ",
    loading: "સેવાઓ લોડ થઈ રહી છે...",
    error: "સેવાઓ લોડ ન થઈ.",
  },
  HI: {
    heading: "हर स्थिति के लिए देखभाल",
    subheading: "अधिक जानने और पास का साथी खोजने के लिए किसी भी सेवा पर क्लिक करें।",
    cta: "सभी सेवाएं और शुल्क देखें",
    loading: "सेवाएं लोड हो रही हैं...",
    error: "सेवाएं लोड नहीं हो सकीं।",
  },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#E8E0D8] animate-pulse">
      <div className="h-4 bg-[#E8E0D8] rounded w-3/4 mb-3" />
      <div className="h-5 bg-[#E8E0D8] rounded-full w-1/3 mb-3" />
      <div className="h-4 bg-[#E8E0D8] rounded w-1/2" />
    </div>
  );
}

export default function ServicesGrid() {
  const { lang } = useLanguage();
  const copy = t[lang];
  const { data: session } = useSession();
  const userRole = (session?.user as { role?: string })?.role ?? null;

  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch("/api/services")
      .then((r) => {
        if (!r.ok) throw new Error("fetch failed");
        return r.json();
      })
      .then((data: ServiceData[]) => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  function handleToggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="bg-[#FEF8F0] py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="font-[family-name:var(--font-playfair)] font-bold text-[#1C2B3A] mb-3"
            style={{ fontSize: "clamp(26px, 3vw, 36px)" }}
          >
            {copy.heading}
          </h2>
          <p
            className="text-[#6B7280] max-w-md mx-auto"
            style={{ fontSize: "clamp(14px, 1.6vw, 16px)" }}
          >
            {copy.subheading}
          </p>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-[#9CA3AF] mb-10">{copy.error}</p>
        )}

        {/* Services grid */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isOpen={openId === service.id}
                onToggle={() => handleToggle(service.id)}
                userRole={userRole}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && !error && (
          <div className="text-center">
            <Link
              href="/services"
              className="inline-block border-2 border-[#1A6B7A] text-[#1A6B7A] rounded-xl px-8 py-3 text-sm font-semibold hover:bg-[#1A6B7A] hover:text-white transition-colors"
            >
              {copy.cta}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
