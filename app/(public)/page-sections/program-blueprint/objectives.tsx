"use client";

import { Blocks, Cpu, GlobeLock, Handshake, Lightbulb, Server } from "lucide-react";

const objectives = [
  {
    icon: Cpu,
    context:
      "Empower youth with in-demand technology skills – hands-on training in Linux, networking, server management, AI, and web development.",
  },
  {
    icon: Blocks,
    context:
      "Bridge the gap between learning and real-world IT work – practical projects that build employable skills.",
  },
  {
    icon: Handshake,
    context:
      "Leverage partnerships with government and non-government organizations to deliver cutting-edge technology training and community development initiatives.",
  },
  {
    icon: Server,
    context: "Prepare students for IT careers – gain experience in building applications, managing servers, and deploying modern systems.",
  },
  {
    icon: Lightbulb,
    context: "Encourage innovation and problem-solving – develop creative solutions through project-based learning.",
  },
];

export default function Objectives() {
  return (
    <>
      <div className="flex flex-col flex-1 w-auto p-8">
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-4xl font-medium text-[#154091] text-shadow-lg">
            Our Objectives
          </h1>
          <p className="text-sm">
            A set of strategic objectives aimed at strengthening ICT
            competencies, supporting workforce readiness, and enabling
            innovation across public and private sectors.
          </p>
        </div>

        <ul className="space-y-4">
          {objectives.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="flex-1">
                <h1>
                  <li className="flex items-start gap-3 text-lg leading-relaxed text-justify">
                    <Icon className="h-6 w-6 mt-1.5 shrink-0 text-foreground border-2 rounded-4xl p-1" />
                    {item.context}
                  </li>
                </h1>
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
}
