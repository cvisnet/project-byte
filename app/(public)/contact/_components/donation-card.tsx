"use client";

import * as React from "react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { createDonationIntent } from "@/actions/donation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatPhp,
  MAX_PHP,
  MIN_PHP,
  PRESET_PHP,
} from "@/lib/stripe/amounts";
import { useToast } from "@/contexts/toast-context";

let stripePromise: Promise<Stripe | null> | null = null;
function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set.");
      stripePromise = Promise.resolve(null);
    } else {
      stripePromise = loadStripe(key);
    }
  }
  return stripePromise;
}

export function DonationCard() {
  const [selectedPreset, setSelectedPreset] = React.useState<number | null>(
    PRESET_PHP[1],
  );
  const [customAmount, setCustomAmount] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);
  const [isCreating, startCreate] = React.useTransition();
  const { toast } = useToast();

  const effectiveAmount = React.useMemo<number | null>(() => {
    if (customAmount.trim().length > 0) {
      const n = Number(customAmount);
      if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
      return n;
    }
    return selectedPreset;
  }, [customAmount, selectedPreset]);

  const amountError = React.useMemo(() => {
    if (effectiveAmount === null) return "Enter a whole peso amount.";
    if (effectiveAmount < MIN_PHP) return `Minimum donation is ${formatPhp(MIN_PHP)}.`;
    if (effectiveAmount > MAX_PHP) return `Maximum donation is ${formatPhp(MAX_PHP)}.`;
    return null;
  }, [effectiveAmount]);

  function handlePresetClick(amount: number) {
    setSelectedPreset(amount);
    setCustomAmount("");
  }

  function handleCustomChange(value: string) {
    const digitsOnly = value.replace(/[^0-9]/g, "").slice(0, 7);
    setCustomAmount(digitsOnly);
    if (digitsOnly.length > 0) setSelectedPreset(null);
  }

  function handleContinue() {
    if (amountError || effectiveAmount === null) {
      toast.error(amountError || "Please enter a valid amount.");
      return;
    }

    startCreate(async () => {
      const result = await createDonationIntent({
        amountPhp: effectiveAmount,
        email: email.trim(),
      });

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      setClientSecret(result.clientSecret);
    });
  }

  function handleReset() {
    setClientSecret(null);
  }

  if (clientSecret) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Donating{" "}
              <span className="text-[#154091]">
                {effectiveAmount ? formatPhp(effectiveAmount) : ""}
              </span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your card details to complete your donation.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={isCreating}
          >
            Change
          </Button>
        </div>

        <Elements
          stripe={getStripe()}
          options={{
            clientSecret,
            appearance: { theme: "stripe" },
          }}
        >
          <DonationPaymentForm />
        </Elements>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">
          Support our <span className="text-[#edd153]">mission</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your donation helps fund training, outreach, and technology for our
          community.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Choose an amount</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESET_PHP.map((amount) => {
            const active = selectedPreset === amount && customAmount === "";
            return (
              <button
                key={amount}
                type="button"
                onClick={() => handlePresetClick(amount)}
                disabled={isCreating}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-[#154091] bg-[#154091] text-white"
                    : "border-input bg-background hover:bg-accent"
                }`}
              >
                {formatPhp(amount)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="donation-custom" className="text-sm font-medium">
          Or enter a custom amount (PHP)
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            ₱
          </span>
          <Input
            id="donation-custom"
            type="text"
            inputMode="numeric"
            placeholder={String(MIN_PHP)}
            value={customAmount}
            onChange={(e) => handleCustomChange(e.target.value)}
            disabled={isCreating}
            className="pl-7"
          />
        </div>
        {customAmount.length > 0 && amountError && (
          <span className="text-xs text-destructive">{amountError}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="donation-email" className="text-sm font-medium">
          Email (for receipt)
        </label>
        <Input
          id="donation-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isCreating}
          maxLength={254}
        />
        <span className="text-xs text-muted-foreground">
          Optional — Stripe will email your donation receipt here.
        </span>
      </div>

      <Button
        type="button"
        onClick={handleContinue}
        disabled={isCreating || Boolean(amountError)}
        className="bg-[#154091] hover:bg-[#0d2657] text-white"
      >
        {isCreating
          ? "Preparing..."
          : effectiveAmount
            ? `Donate ${formatPhp(effectiveAmount)}`
            : "Donate"}
      </Button>

      <p className="text-xs text-muted-foreground">
        Secure payment powered by Stripe. Your card details never touch our
        servers.
      </p>
    </div>
  );
}

function DonationPaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsPaying(true);
    setErrorMessage(null);

    const returnUrl = `${window.location.origin}/contact/donation-success`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    if (error) {
      setErrorMessage(error.message ?? "Payment failed. Please try again.");
      setIsPaying(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      <Button
        type="submit"
        disabled={!stripe || !elements || isPaying}
        className="bg-[#154091] hover:bg-[#0d2657] text-white"
      >
        {isPaying ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
}
