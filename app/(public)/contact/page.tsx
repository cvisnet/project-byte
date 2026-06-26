import React from "react";

import { ContactForm } from "./_components/contact-form";
import { DonationCard } from "./_components/donation-card";
import Footer from "../page-sections/footer";

export default function Contact() {
  return (
    <>
      <div className="relative mx-auto my-12 flex w-full max-w-5xl flex-col gap-8 px-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Contact Us</h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Support our mission with a donation, or send us a message — we're
            happy to hear from you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DonationCard />
          <ContactForm />
        </div>
      </div>
      <Footer />
    </>
  );
}
