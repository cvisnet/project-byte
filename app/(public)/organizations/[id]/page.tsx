import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TraineeCards from "./partials/trainee-cards";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrganizationDetails({ params }: PageProps) {
  const { id } = await params;

  const org = await prisma.organization.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      acronym: true,
      location: true,
      trainingStartedAt: true,
      profilePhoto: true,
      trainees: {
        orderBy: {
          fullName: "asc",
        },
        select: {
          id: true,
          profilePhoto: true,
          fullName: true,
          email: true,
          phoneNumber: true,
          address: true,
          skills: true,
        },
      },
    },
  });

  if (!org) {
    notFound();
  }

  return (
    <>
      <div className="container mx-auto mb-16 max-w-4xl px-6 py-8 text-justify">
        <Link
          href="/organizations"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Organizations
        </Link>

        <div className="flex flex-col gap-8 md:flex-row">
          {org?.profilePhoto && (
            <div className="relative aspect-video h-40 overflow-hidden rounded-lg">
              <Image
                src={org.profilePhoto}
                alt={org.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          <div className="flex w-full flex-col justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-bold">
                {org.acronym} - {org.name}
              </h1>
              <p className="text-lg text-muted-foreground">{org.location}</p>
            </div>

            <div className="flex justify-end">
              <time className="block text-sm text-muted-foreground">
                Joined:{" "}
                {org?.trainingStartedAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
        </div>
      </div>

      <TraineeCards trainees={org.trainees} />
    </>
  );
}
