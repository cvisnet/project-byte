"use client";

import Image from "next/image";

const objectives = [
  {
    icon: "/objectives-icon/programming.png",
    bg: "bg-violet-100 dark:bg-violet-500/15",
    context:
      "Empower youth with in-demand technology skills \u2013 hands-on training in Linux, networking, server management, AI, and web development.",
  },
  {
    icon: "/objectives-icon/puzzle.png",
    bg: "bg-lime-100 dark:bg-lime-500/15",
    context:
      "Bridge the gap between learning and real-world IT work \u2013 practical projects that build employable skills.",
  },
  {
    icon: "/objectives-icon/handshake.png",
    bg: "bg-amber-100 dark:bg-amber-500/15",
    context:
      "Leverage partnerships with government and non-government organizations to deliver cutting-edge technology training and community development initiatives.",
  },
  {
    icon: "/objectives-icon/server.png",
    bg: "bg-cyan-100 dark:bg-cyan-500/15",
    context:
      "Prepare students for IT careers \u2013 gain experience in building applications, managing servers, and deploying modern systems.",
  },
  {
    icon: "/objectives-icon/lightbulb.png",
    bg: "bg-yellow-100 dark:bg-yellow-500/15",
    context:
      "Encourage innovation and problem-solving \u2013 develop creative solutions through project-based learning.",
  },
];

export default function Objectives() {
  return (
    <div className="flex flex-1 flex-col p-2 lg:p-4">
      <div className="mb-6 flex flex-col gap-2">
        <h3 className="text-2xl font-semibold text-brand-blue">
          Our Objectives
        </h3>
        <p className="text-sm text-muted-foreground">
          A set of strategic objectives aimed at strengthening ICT
          competencies, supporting workforce readiness, and enabling
          innovation across public and private sectors.
        </p>
      </div>

      <div className="space-y-3">
        {objectives.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-start gap-4 rounded-lg border border-l-4 border-l-brand-blue bg-card p-4 transition-shadow hover:shadow-sm"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${item.bg}`}>
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                />
              </div>
              <p className="text-sm leading-relaxed lg:text-base">
                {item.context}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
