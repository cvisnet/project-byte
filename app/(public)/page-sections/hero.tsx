"use client"

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GridBackground } from "../../../components/grid-background";

export default function Hero() {
  return (
    <section className="relative mx-auto flex max-w-7xl flex-col items-center justify-center gap-10 px-6 py-16 lg:flex-row lg:py-24">
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl font-bold text-brand-blue lg:text-5xl">
          Building Youth Through Technology Empowerment{" "}
          <span className="text-brand-gold">Project</span>
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          <strong className="text-foreground">A multi-sectoral technology training program</strong>{" "}
          that empowers youth with in-demand digital skills through hands-on,
          project-based learning in partnership with government and
          non-government organizations.
        </p>
        <Link
          href="/#contact"
          className="group inline-flex w-fit items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-brand-blue-light"
        >
          Get Started
           <span className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      <div className="w-full flex-1 overflow-hidden rounded-3xl">
        <GridBackground />
      </div>
    </section>
  );
}
