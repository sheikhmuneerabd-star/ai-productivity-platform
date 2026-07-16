"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(priceId: string) {
  const session = await requireSession();
  const origin = (await headers()).get("origin");

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer: subscription?.stripeCustomerId ?? undefined,
    customer_email: subscription?.stripeCustomerId ? undefined : session.user.email,
    client_reference_id: session.user.id,
    metadata: { userId: session.user.id },
    success_url: `${origin}/dashboard/subscription?success=1`,
    cancel_url: `${origin}/dashboard/subscription`,
  });

  if (!checkoutSession.url) {
    throw new Error("Could not create checkout session");
  }

  redirect(checkoutSession.url);
}

export async function createPortalSession() {
  const session = await requireSession();
  const origin = (await headers()).get("origin");

  const subscription = await db.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.stripeCustomerId) {
    throw new Error("No billing account found");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${origin}/dashboard/subscription`,
  });

  redirect(portalSession.url);
}