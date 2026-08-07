import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { PricingSection } from "@/components/marketing/pricing-section";
import { CtaSection, MarketingFooter } from "@/components/marketing/cta-footer";

export const metadata: Metadata = {
  title: "AI Platform — Every AI tool in one workbench",
  description:
    "18 AI tools for writing, code, and productivity in a single dashboard. Start free with 50 credits.",
};

export default function HomePage() {
  return (
    <div>
      <MarketingNav />
      <Hero />
      <Features />
      <PricingSection />
      <CtaSection />
      <MarketingFooter />
    </div>
  );
}