import { LandingPageGeneratorForm } from "@/components/tools/landing-page-generator-form";

export default function LandingPagePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Landing page generator</h1>
      </div>
      <LandingPageGeneratorForm />
    </div>
  );
}