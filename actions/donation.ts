"use server";

import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { z } from "zod";

import { checkRateLimit } from "@/lib/rate-limit";
import { CURRENCY, MAX_PHP, MIN_PHP, toCentavos } from "@/lib/stripe/amounts";
import { stripe } from "@/lib/stripe/server";

const Schema = z.object({
  amountPhp: z
    .number()
    .int("Amount must be a whole peso value.")
    .min(MIN_PHP, `Minimum donation is ₱${MIN_PHP}.`)
    .max(MAX_PHP, `Maximum donation is ₱${MAX_PHP.toLocaleString()}.`),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .max(254)
    .optional()
    .or(z.literal("")),
});

export type CreateDonationIntentInput = z.infer<typeof Schema>;

export type CreateDonationIntentResult =
  | { ok: true; clientSecret: string }
  | { ok: false; error: string };

async function getCallerIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") || "unknown";
}

export async function createDonationIntent(
  input: CreateDonationIntentInput,
): Promise<CreateDonationIntentResult> {
  const parsed = Schema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Invalid input.",
    };
  }

  const ip = await getCallerIp();
  const rl = checkRateLimit(`donate:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.ok) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  const { amountPhp, email } = parsed.data;

  try {
    const intent = await stripe.paymentIntents.create(
      {
        amount: toCentavos(amountPhp),
        currency: CURRENCY,
        automatic_payment_methods: { enabled: true },
        receipt_email: email && email.length > 0 ? email : undefined,
        description: "Project BYTE donation",
        metadata: { source: "contact-page" },
      },
      { idempotencyKey: randomUUID() },
    );

    if (!intent.client_secret) {
      console.error("Stripe returned PaymentIntent without client_secret");
      return { ok: false, error: "Payment setup failed. Please try again." };
    }

    return { ok: true, clientSecret: intent.client_secret };
  } catch (err) {
    console.error("createDonationIntent error:", err);
    return { ok: false, error: "Payment setup failed. Please try again." };
  }
}
