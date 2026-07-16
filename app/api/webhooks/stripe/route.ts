import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { PRICE_IDS } from "@/lib/stripe";

function planFromPriceId(priceId: string): "PRO" | "BUSINESS" | null {
  if (priceId === PRICE_IDS.PRO_MONTHLY || priceId === PRICE_IDS.PRO_YEARLY) return "PRO";
  if (priceId === PRICE_IDS.BUSINESS_MONTHLY || priceId === PRICE_IDS.BUSINESS_YEARLY) return "BUSINESS";
  return null;
}

const PLAN_CREDITS = { PRO: 1000, BUSINESS: 100000 } as const;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string);
  } catch (err) {
    return new Response(`Webhook signature verification failed`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId ?? session.client_reference_id;
      if (!userId || !session.subscription || !session.customer) break;

      const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = stripeSubscription.items.data[0]?.price.id;
      const plan = priceId ? planFromPriceId(priceId) : null;

      await db.subscription.update({
        where: { userId },
        data: {
          plan: plan ?? "FREE",
          status: "ACTIVE",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          currentPeriodEnd: new Date(stripeSubscription.items.data[0].current_period_end * 1000),
        },
      });

      if (plan) {
        await db.credits.update({
          where: { userId },
          data: { balance: PLAN_CREDITS[plan] },
        });
      }

      await db.notification.create({
        data: {
          userId,
          title: "Subscription activated",
          message: `Your ${plan ?? "plan"} subscription is now active.`,
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const stripeSubscription = event.data.object;
      const existing = await db.subscription.findFirst({
        where: { stripeSubscriptionId: stripeSubscription.id },
      });
      if (!existing) break;

      const priceId = stripeSubscription.items.data[0]?.price.id;
      const plan = priceId ? planFromPriceId(priceId) : null;

      await db.subscription.update({
        where: { id: existing.id },
        data: {
          plan: plan ?? existing.plan,
          status: stripeSubscription.status === "active" ? "ACTIVE" : "PAST_DUE",
          currentPeriodEnd: new Date(stripeSubscription.items.data[0].current_period_end * 1000),
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const stripeSubscription = event.data.object;
      const existing = await db.subscription.findFirst({
        where: { stripeSubscriptionId: stripeSubscription.id },
      });
      if (!existing) break;

      await db.subscription.update({
        where: { id: existing.id },
        data: { plan: "FREE", status: "CANCELED" },
      });

      await db.notification.create({
        data: {
          userId: existing.userId,
          title: "Subscription canceled",
          message: "Your plan has been downgraded to Free.",
        },
      });
      break;
    }
  }

  return new Response(null, { status: 200 });
}