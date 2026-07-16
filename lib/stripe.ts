import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRICE_PRO_MONTHLY as string,
  PRO_YEARLY: process.env.STRIPE_PRICE_PRO_YEARLY as string,
  BUSINESS_MONTHLY: process.env.STRIPE_PRICE_BUSINESS_MONTHLY as string,
  BUSINESS_YEARLY: process.env.STRIPE_PRICE_BUSINESS_YEARLY as string,
} as const;