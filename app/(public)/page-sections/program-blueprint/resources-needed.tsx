"use client";

import { CheckSquare, PackageCheck } from "lucide-react";

const resources = [
  {
    context:
      "Computers and Laptops \u2013 Capable of running Linux, development tools, and AI models.",
  },
  {
    context:
      "Peripherals \u2013 Monitors, keyboards, mice, and headphones for effective coding and project work.",
  },
  {
    context:
      "Networking Equipment \u2013 Routers, switches, and cabling for hands-on networking labs.",
  },
  {
    context:
      "AI Server \u2013 High-performance server for running machine learning models, AI projects, and local large language models (LLMs).",
  },
  {
    context:
      "Reliable Internet Connectivity \u2013 High-speed internet for research, cloud services, and collaboration.",
  },
  {
    context:
      "Power & Utilities \u2013 Electricity and basic facilities for the training center, ensuring uninterrupted learning sessions.",
  },
  {
    context:
      "Funding for Center Operations \u2013 Includes staff salaries, utilities, and infrastructure maintenance.",
  },
  {
    context:
      "Community & Stakeholder Partnerships \u2013 Government agencies, NGOs, tech companies, and educational institutions for mentorship, sponsorships, and project collaborations.",
  },
];

export default function ResourcesNeeded() {
  return (
    <div className="flex flex-1 flex-col rounded-2xl border bg-card shadow-sm p-8">
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <PackageCheck className="h-5 w-5 shrink-0 text-brand-blue" />
          <h4 className="text-xl font-semibold text-brand-blue">
            Resources Needed
          </h4>
        </div>
        <p className="text-sm text-muted-foreground">
          To ensure a high-quality, hands-on learning experience for trainees,
          BYTE requires a combination of technical, human, and operational
          resources.
        </p>
      </div>

      <div className="space-y-3">
        {resources.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckSquare className="mt-1 h-4 w-4 shrink-0 text-brand-blue/60" />
            <p className="text-sm leading-relaxed">{item.context}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
