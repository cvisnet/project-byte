"use client";

import { PackageCheck, Square } from "lucide-react";

const resources = [
  {
    context: "Computers and Laptops – Capable of running Linux, development tools, and AI models.",
  },
  {
    context: "Peripherals – Monitors, keyboards, mice, and headphones for effective coding and project work.",
  },
  {
    context: "Networking Equipment – Routers, switches, and cabling for hands-on networking labs.",
  },
  {
    context: "AI Server – High-performance server for running machine learning models, AI projects, and local large language models (LLMs).",
  },
  {
    context: "Reliable Internet Connectivity – High-speed internet for research, cloud services, and collaboration.",
  },
  {
    context: "Power & Utilities – Electricity and basic facilities for the training center, ensuring uninterrupted learning sessions.",
  },
  {
    context: "Funding for Center Operations – Includes staff salaries, utilities, and infrastructure maintenance.",
  },
  {
    context: "Community & Stakeholder Partnerships – Government agencies, NGOs, tech companies, and educational institutions for mentorship, sponsorships, and project collaborations.",
  },
];

export default function ResourcesNeeded() {
  return (
    <>
      <div className="flex flex-col flex-1 w-auto p-8 bg-[#fafbfb] rounded-3xl border dark:bg-accent/50">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
          <PackageCheck className="h-6 w-6 mt-1.5 shrink-0 text-foreground border border-foreground/20 rounded-full p-1" />

          <h1 className="text-2xl font-medium text-[#154091]">
            Resources Needed
          </h1>
          </div>
          <p className="text-sm">To ensure a high-quality, hands-on learning experience for trainees BYTE requires a combination of technical, human, and operational resources.</p>
        </div>

        <ul className="space-y-4">
          {resources.map((item, index) => {
            return (
              <div key={index} className="flex-1">
                <h2 className="ml-6 ">
                  <li className="flex items-start gap-3 text-md leading-relaxed text-justify">
                    <Square className="h-4 w-4 mt-2 shrink-0 " />
                    {item.context}
                  </li>
                </h2>
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
}
