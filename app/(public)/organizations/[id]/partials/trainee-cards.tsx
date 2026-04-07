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

export default function TraineeCards({ trainees }: TraineeCardsProps) {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  if (trainees.length === 0) {
    return (
      <section className="container mx-auto max-w-4xl px-4">
        <h1 className="mb-4 text-2xl font-semibold">Trainees</h1>
        <p className="text-sm text-muted-foreground">No trainees yet.</p>
      </section>
    );
  }

  return (
    <div className="relative mx-auto my-10 flex max-w-300 flex-col items-start justify-center gap-10 pb-12">
      <h1 className="text-2xl font-semibold">Trainees</h1>

      <div className="container grid w-full grid-cols-4 items-start gap-4 drop-shadow-xl">
        {trainees.map((trainee) => {
          const isExpanded = expandedCardId === trainee.id;
          const previewSkills = trainee.skills.slice(0, 3);
          const hiddenCount = Math.max(trainee.skills.length - 3, 0);

          return (
            <div key={trainee.id} className="relative">
              <div
                onClick={() => setExpandedCardId(isExpanded ? null : trainee.id)}
                className="container flex cursor-pointer flex-col items-center gap-3 rounded-4xl border bg-background px-6 py-4 transition-shadow duration-300 hover:shadow-md"
              >
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
                  <div className="absolute inset-x-0 bottom-0 z-0 h-30 rounded-t-2xl bg-[#C2E2FA]" />
                </div>

                <div className="relative mb-2 flex w-full flex-col items-start text-center">
                  <h1 className="text-lg font-semibold">{trainee.fullName}</h1>
                  <p className="text-xs font-normal">{trainee.email}</p>
                  <p className="text-xs font-normal">{trainee.phoneNumber}</p>

                  <div className="my-4 flex w-full flex-wrap gap-1">
                    {previewSkills.map((skill, index) => (
                      <Badge
                        key={`${trainee.id}-preview-${index}`}
                        variant="outline"
                        asChild
                        className="max-w-full whitespace-normal break-words"
                      >
                        <span className="font-normal">{skill}</span>
                      </Badge>
                    ))}
                    {hiddenCount > 0 && <Badge variant="outline">+{hiddenCount} more</Badge>}
                  </div>

                  <p className="mt-2 self-end text-sm font-normal">{trainee.address}</p>
                </div>
              </div>

              {isExpanded && (
                <div
                  onClick={() => setExpandedCardId(null)}
                  className="absolute left-0 top-0 z-30 container flex w-full cursor-pointer flex-col items-center gap-3 rounded-4xl border bg-background px-6 py-4 shadow-xl ring-1 ring-border transition-all duration-300"
                >
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
                    <div className="absolute inset-x-0 bottom-0 z-0 h-30 rounded-t-2xl bg-[#C2E2FA]" />
                  </div>

                  <div className="relative mb-2 flex w-full flex-col items-start text-center">
                    <h1 className="text-lg font-semibold">{trainee.fullName}</h1>
                    <h2 className="text-xs font-normal">{trainee.email}</h2>
                    <h2 className="text-xs font-normal">{trainee.phoneNumber}</h2>

                    <div className="my-4 flex w-full flex-wrap gap-1">
                      {trainee.skills.map((skill, index) => (
                        <Badge
                          key={`${trainee.id}-expanded-${index}`}
                          variant="outline"
                          asChild
                          className="max-w-full whitespace-normal break-words"
                        >
                          <span className="font-normal">{skill}</span>
                        </Badge>
                      ))}
                    </div>

                    <h2 className="mt-2 self-end text-sm font-normal">{trainee.address}</h2>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
