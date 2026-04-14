"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export type Trainee = {
  id: string;
  fullName: string;
  profilePhoto: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  skills: string[];
};

export type TraineeCardsProps = {
  trainees: Trainee[];
};

function TraineeCardContent({
  trainee,
  showAllSkills,
}: {
  trainee: Trainee;
  showAllSkills: boolean;
}) {
  const previewSkills = trainee.skills.slice(0, 3);
  const hiddenCount = Math.max(trainee.skills.length - 3, 0);
  const skillsToShow = showAllSkills ? trainee.skills : previewSkills;

  return (
    <>
      <div className="relative aspect-square h-60 shrink-0 overflow-hidden">
        {trainee.profilePhoto ? (
          <Image
            src={trainee.profilePhoto}
            alt={trainee.fullName}
            fill
            className="z-10 object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 z-10 flex items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 z-0 h-30 rounded-t-2xl bg-brand-blue/10" />
      </div>

      <div className="relative mb-2 flex w-full flex-col items-start text-center">
        <p className="text-lg font-semibold">{trainee.fullName}</p>
        <p className="text-xs text-muted-foreground">{trainee.email}</p>
        <p className="text-xs text-muted-foreground">{trainee.phoneNumber}</p>

        <div className="my-4 flex w-full flex-wrap gap-1">
          {skillsToShow.map((skill, index) => (
            <Badge
              key={`${trainee.id}-${showAllSkills ? "expanded" : "preview"}-${index}`}
              variant="outline"
              asChild
              className="max-w-full whitespace-normal break-words"
            >
              <span className="font-normal">{skill}</span>
            </Badge>
          ))}
          {!showAllSkills && hiddenCount > 0 && (
            <Badge variant="outline">+{hiddenCount} more</Badge>
          )}
        </div>

        <p className="mt-2 self-end text-sm text-muted-foreground">
          {trainee.address}
        </p>
      </div>
    </>
  );
}

export default function TraineeCards({ trainees }: TraineeCardsProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  if (trainees.length === 0) {
    return (
      <section className="container mx-auto max-w-4xl px-6">
        <h2 className="mb-4 text-2xl font-semibold">Trainees</h2>
        <p className="text-sm text-muted-foreground">No trainees yet.</p>
      </section>
    );
  }

  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-start justify-center gap-10 px-6 pb-12">
      <h2 className="text-2xl font-semibold">Trainees</h2>

      <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {trainees.map((trainee) => {
          const isExpanded = expandedCardId === trainee.id;

          return (
            <div key={trainee.id} className="relative">
              <div
                onClick={() =>
                  setExpandedCardId(isExpanded ? null : trainee.id)
                }
                className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border bg-background px-6 py-4 transition-shadow duration-300 hover:shadow-md"
              >
                <TraineeCardContent
                  trainee={trainee}
                  showAllSkills={false}
                />
              </div>

              {isExpanded && (
                <div
                  onClick={() => setExpandedCardId(null)}
                  className="absolute left-0 top-0 z-30 flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border bg-background px-6 py-4 shadow-xl ring-1 ring-border transition-all duration-300"
                >
                  <TraineeCardContent
                    trainee={trainee}
                    showAllSkills={true}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
