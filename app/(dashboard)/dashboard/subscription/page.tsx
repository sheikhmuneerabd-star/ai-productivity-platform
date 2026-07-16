import { Check } from "lucide-react";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { plans } from "@/config/plans.config";
import { Card } from "@/components/ui/card";
import { PlanCheckoutButton } from "@/components/dashboard/plan-checkout-button";
import { ManageBillingButton } from "@/components/dashboard/manage-billing-button";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await requireSession();
  const params = await searchParams;

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const currentPlan = subscription?.plan ?? "FREE";

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Account</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Subscription</h1>
      </div>

      {params.success && (
        <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-success">
          Payment successful — your plan has been updated.
        </div>
      )}

      {subscription?.stripeCustomerId && (
        <Card className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-paper-900">Current plan: {currentPlan}</p>
            <p className="text-xs text-paper-500">Manage payment method, invoices, and cancellation</p>
          </div>
          <ManageBillingButton />
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((p) => {
          const isCurrent = p.plan === currentPlan;
          const priceIdMonthly = p.priceIdMonthlyEnv
            ? process.env[p.priceIdMonthlyEnv as "STRIPE_PRICE_PRO_MONTHLY"]
            : undefined;

          return (
            <Card key={p.plan} className={isCurrent ? "border-amber-400 p-5" : "p-5"}>
              <p className="font-display text-base font-medium text-paper-900">{p.name}</p>
              <p className="mt-2">
                <span className="font-mono text-2xl font-medium text-paper-900">
                  ${p.priceMonthly}
                </span>
                <span className="text-xs text-paper-500">/month</span>
              </p>

              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-paper-700">
                    <Check className="h-3.5 w-3.5 shrink-0 text-amber-500" strokeWidth={2} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-5">
                {isCurrent ? (
                  <div className="rounded-md border border-paper-200 py-2 text-center text-sm text-paper-500">
                    Current plan
                  </div>
                ) : priceIdMonthly ? (
                  <PlanCheckoutButton priceId={priceIdMonthly} label={`Upgrade to ${p.name}`} />
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}