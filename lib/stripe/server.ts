import "server-only";

import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    "STRIPE_SECRET_KEY is not set. Add it to your environment before using Stripe.",
  );
}

export const stripe = new Stripe(secretKey, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});
