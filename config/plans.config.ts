export const plans = [
  {
    name: "Free",
    plan: "FREE" as const,
    priceMonthly: 0,
    priceYearly: 0,
    features: ["50 credits / month", "Access to core AI tools", "Community support"],
  },
  {
    name: "Pro",
    plan: "PRO" as const,
    priceMonthly: 19,
    priceYearly: 190,
    features: ["1,000 credits / month", "All AI tools", "Priority generation speed", "Email support"],
    priceIdMonthlyEnv: "STRIPE_PRICE_PRO_MONTHLY",
    priceIdYearlyEnv: "STRIPE_PRICE_PRO_YEARLY",
  },
  {
    name: "Business",
    plan: "BUSINESS" as const,
    priceMonthly: 49,
    priceYearly: 490,
    features: ["Unlimited credits", "All AI tools", "Team seats", "Priority support"],
    priceIdMonthlyEnv: "STRIPE_PRICE_BUSINESS_MONTHLY",
    priceIdYearlyEnv: "STRIPE_PRICE_BUSINESS_YEARLY",
  },
];