import Link from "next/link";
import { Check } from "lucide-react";
import { plans } from "@/config/plans.config";

export function PricingSection() {
  return (
    <section id="pricing" className="bg-graphite-950 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-graphite-500">Pricing</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-graphite-100 lg:text-3xl">
            Simple, credit-based pricing
          </h2>
          <p className="mt-3 text-sm text-graphite-400">Start free. Upgrade only when you need more credits.</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.plan}
              className={
                p.plan === "PRO"
                  ? "rounded-lg border border-amber-500 bg-graphite-900 p-6"
                  : "rounded-lg border border-graphite-700 bg-graphite-900 p-6"
              }
            >
              {p.plan === "PRO" && (
                <span className="mb-3 inline-block rounded-full bg-amber-500 px-2 py-0.5 font-mono text-[10px] text-graphite-900">
                  MOST POPULAR
                </span>
              )}
              <p className="font-display text-base font-medium text-graphite-100">{p.name}</p>
              <p className="mt-2">
                <span className="font-mono text-2xl font-medium text-graphite-100">${p.priceMonthly}</span>
                <span className="text-xs text-graphite-500">/month</span>
              </p>

              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-graphite-100">
                    <Check className="h-3.5 w-3.5 shrink-0 text-amber-500" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={
                  p.plan === "PRO"
                    ? "mt-6 block rounded-md bg-amber-500 py-2 text-center text-sm font-medium text-graphite-900 hover:bg-amber-400"
                    : "mt-6 block rounded-md border border-graphite-700 py-2 text-center text-sm text-graphite-100 hover:bg-graphite-800"
                }
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}