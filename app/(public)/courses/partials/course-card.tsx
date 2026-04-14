"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const courseItem = [
  {
    image:
      "/images/courses-and-projects/courses/fundamentals-of-operating-systems.webp",
    title: "Fundamentals of Operating Systems",
    difficulty: "Novice",
    tags: ["Operating Systems"],
    context:
      "This course introduces how operating systems work behind the scenes. You'll explore how software interacts with hardware and how an operating system manages programs, memory, and system resources to keep everything running smoothly.",
  },
  {
    image:
      "/images/courses-and-projects/courses/introduction-to-linux.webp",
    title: "Introduction to Linux",
    difficulty: "Intermediate",
    tags: ["Linux", "Bash"],
    context:
      "This course introduces the Linux operating system and its basic concepts. You will learn how to navigate the Linux environment, use the command line, and understand how Linux manages files, users, and processes.",
  },
  {
    image:
      "/images/courses-and-projects/courses/computer-architecture.webp",
    title: "Computer Architecture",
    difficulty: "Intermediate",
    tags: ["System Unit"],
    context:
      "This course introduces how computers are built and how their components work together. You will learn how processors, memory, and input/output devices interact to execute programs efficiently.",
  },
  {
    image:
      "/images/courses-and-projects/courses/networking.webp",
    title: "Networking",
    difficulty: "Intermediate",
    tags: ["Routers", "LAN"],
    context:
      "This course introduces the fundamentals of computer networking. You will learn how devices communicate, how data is transmitted across networks, and the basics of protocols, IP addressing, and network security.",
  },
  {
    image:
      "/images/courses-and-projects/courses/server-setup.webp",
    title: "Server Setup",
    difficulty: "Advance",
    tags: ["Linux", "Server", "Bash"],
    context:
      "This course introduces the basics of setting up and managing servers. You will learn how to install server software, configure services, manage users, and ensure your server runs securely and reliably.",
  },
  {
    image:
      "/images/courses-and-projects/courses/ai-introduction.webp",
    title: "AI Introduction",
    difficulty: "Novice",
    tags: ["AI"],
    context:
      "This course introduces the fundamentals of artificial intelligence. You will learn about basic AI concepts, how machines can perform tasks that typically require human intelligence, and an overview of machine learning and problem-solving techniques.",
  },
  {
    image:
      "/images/courses-and-projects/courses/ai-tools-and-system-integration.webp",
    title: "AI Tools and System Integration",
    difficulty: "Advance",
    tags: ["AI", "Linux", "Bash"],
    context:
      "This course introduces the fundamentals of artificial intelligence. You will learn about basic AI concepts, how machines can perform tasks that typically require human intelligence, and an overview of machine learning and problem-solving techniques.",
  },
  {
    image:
      "/images/courses-and-projects/courses/execution-and-deployment.webp",
    title: "Execution and Deployment",
    difficulty: "Advance",
    tags: ["Linux", "Server", "Bash"],
    context:
      "This course introduces how to execute software projects and deploy them in real environments. You will learn best practices for testing, deployment, monitoring, and ensuring your applications run reliably and efficiently.",
  },
];

function DifficultyBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Novice: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Advance: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[level] ?? ""}`}>
      {level}
    </span>
  );
}

export default function CourseCard() {
  return (
    <>
      {courseItem.map((item, index) => {
        return (
          <div
            key={index}
            className="h-fit rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full md:w-5/12">
                <div className="overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={250}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <div className="w-full md:w-7/12">
                <h3 className="flex items-start justify-between text-lg font-medium">
                  {item.title}
                </h3>
                <div className="mt-2">
                  <DifficultyBadge level={item.difficulty} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1">
                  {item.tags.map((tag, tagIndex) => {
                    return (
                      <Badge key={tagIndex} variant="outline">
                        <span className="font-normal">{tag}</span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {item.context}
            </p>
          </div>
        );
      })}
    </>
  );
}
