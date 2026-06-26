import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPhp } from "@/lib/stripe/amounts";
import { stripe } from "@/lib/stripe/server";
import Footer from "../../page-sections/footer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export const dynamic = "force-dynamic";

export default async function DonationSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawId = params["payment_intent"];
  const paymentIntentId = typeof rawId === "string" ? rawId : undefined;

  let state:
    | { kind: "succeeded"; amountPhp: number }
    | { kind: "processing" }
    | { kind: "failed"; reason: string }
    | { kind: "unknown" } = { kind: "unknown" };

  if (paymentIntentId) {
    try {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const amountPhp = Math.round((intent.amount ?? 0) / 100);

      if (intent.status === "succeeded") {
        state = { kind: "succeeded", amountPhp };
      } else if (
        intent.status === "processing" ||
        intent.status === "requires_action"
      ) {
        state = { kind: "processing" };
      } else {
        state = {
          kind: "failed",
          reason: intent.last_payment_error?.message ?? "Payment not completed.",
        };
      }
    } catch (err) {
      console.error("donation-success retrieve error:", err);
      state = { kind: "unknown" };
    }
  }

  return (
    <>
      <div className="relative mx-auto my-20 flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
        {state.kind === "succeeded" && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-600" />
            <h1 className="text-3xl font-bold">Thank you for your donation!</h1>
            <p className="text-muted-foreground">
              Your gift of{" "}
              <span className="font-semibold text-foreground">
                {formatPhp(state.amountPhp)}
              </span>{" "}
              will help us continue our mission. A receipt has been emailed to
              you.
            </p>
          </>
        )}

        {state.kind === "processing" && (
          <>
            <h1 className="text-3xl font-bold">Your donation is processing</h1>
            <p className="text-muted-foreground">
              We'll email your receipt as soon as the payment is confirmed.
            </p>
          </>
        )}

        {state.kind === "failed" && (
          <>
            <XCircle className="h-16 w-16 text-destructive" />
            <h1 className="text-3xl font-bold">Donation not completed</h1>
            <p className="text-muted-foreground">{state.reason}</p>
          </>
        )}

        {state.kind === "unknown" && (
          <>
            <XCircle className="h-16 w-16 text-muted-foreground" />
            <h1 className="text-3xl font-bold">We couldn't find your donation</h1>
            <p className="text-muted-foreground">
              If you believe this is an error, please contact us.
            </p>
          </>
        )}

        <Button asChild className="bg-[#154091] hover:bg-[#0d2657] text-white">
          <Link href="/contact">Back to Contact</Link>
        </Button>
      </div>
      <Footer />
    </>
  );
}
