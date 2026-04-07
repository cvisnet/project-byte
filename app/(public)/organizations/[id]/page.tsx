import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
          fullName: "asc"
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
      <div className="container mx-auto px-4 py-8 max-w-4xl mb-16">
        {/* Back link */}
        <Link
          href="/organizations"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          &larr; Back to Organizations
        </Link>

        <div className="flex gap-8">
          {/* Featured Image */}
          {org?.profilePhoto && (
            <div className="relative aspect-video h-40 rounded-lg overflow-hidden">
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

          <div className="flex flex-col justify-between w-full ">
            <div>
              {/* Title */}
              <h1 className="text-4xl font-bold mb-2">
                {org.acronym} - {org.name}
              </h1>

              {/* Organization Name */}
              <h1 className="text-lg mb-4">{org.location}</h1>
            </div>

            <div className="flex justify-end">
              {/* Date */}
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
