"use client";

import * as React from "react";

import { sendContactMessage } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/contexts/toast-context";

export function ContactForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const formRef = React.useRef<HTMLFormElement>(null);

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await sendContactMessage(formData);
      if (result.ok) {
        toast.success("Message sent. We'll get back to you soon.");
        formRef.current?.reset();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={onSubmit}
      className="flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold">
          Send us an <span className="text-[#154091]">email</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Have a question or suggestion? We'd love to hear from you.
        </p>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
      >
        <label>
          Company (leave this empty)
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          maxLength={120}
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          maxLength={254}
          disabled={isPending}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium">
          Message
        </label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="How can we help?"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="bg-[#154091] hover:bg-[#0d2657] text-white"
      >
        {isPending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
