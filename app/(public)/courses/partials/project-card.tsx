"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

const projectItems = [
  {
    image: "/images/courses-and-projects/projects/wordpress-development.webp",
    title: "WordPress Development",
    tags: ["WordPress", "Elementor"],
  },
  {
    image: "/images/courses-and-projects/projects/local-ai-model.webp",
    title: "Building and Running AI Models Locally",
    tags: ["AI", "LLM"],
  },
  {
    image: "/images/courses-and-projects/projects/frontend-development.webp",
    title: "Frontend Development with Vite + React",
    tags: ["Vite", "React", "TypeScript"],
  },
  {
    image: "/images/courses-and-projects/projects/build-server-environment.webp",
    title: "Building a Functional Server Environment",
    tags: ["Linux Server", "Nginx", "Self Hosted Infrastructure"],
  },
];

export function ProjectCard() {
  return (
    <>
      {projectItems.map((item, index) => {
        return (
          <Card
            key={index}
            className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl pt-0"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={400}
              height={225}
              className="aspect-video w-full object-cover"
              unoptimized
            />
            <CardContent>
              <h3 className="text-foreground">{item.title}</h3>
              <div className="mt-4 flex flex-wrap justify-end gap-1">
                {item.tags.map((tag, tagIndex) => {
                  return (
                    <Badge key={tagIndex} variant="outline">
                      <span className="font-normal">{tag}</span>
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
