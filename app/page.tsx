import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Features } from "@/components/marketing/features";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CtaSection, MarketingFooter } from "@/components/marketing/cta-footer";

export const metadata: Metadata = {
  title: "AI Assistant — One assistant, 18 tools, zero tab chaos",
  description:
    "A single AI assistant that writes, codes, summarizes, and translates — 18 tools in one dashboard. Start free with 50 credits.",
};

export default function HomePage() {
  return (
    <div>
      <MarketingNav />
      <Hero />
      <HowItWorks />
      <Features />
      <PricingSection />
      <CtaSection />
      <MarketingFooter />
    </div>
  );
}