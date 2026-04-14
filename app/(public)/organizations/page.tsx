import prisma from "@/lib/db";
import Link from "next/link";
import OrganizationsList from "./organizations-list";

const INITIAL_VISIBLE_COUNT = 15;

export default async function OrganizationsPage() {
  const [organizations, totalCount] = await Promise.all([
    prisma.organization.findMany({
      orderBy: { trainingStartedAt: "desc" },
      take: INITIAL_VISIBLE_COUNT,
      select: {
        id: true,
        acronym: true,
        name: true,
        location: true,
        profilePhoto: true,
        trainingStartedAt: true,
      },
    }),
    prisma.organization.count(),
  ]);

  const serializedOrganizations = organizations.map((org) => ({
    ...org,
    trainingStartedAt: org.trainingStartedAt.toISOString(),
  }));

  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center gap-10 px-6 pb-12">
      <div className="flex w-full flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-3xl font-bold">Organizations</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Institutions affiliated with Byte through curriculum adoption or
            collaboration.
          </p>
        </div>
        <Link
          href="/#contact"
          className="group inline-flex w-fit items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-brand-blue-light"
        >
          Apply for BYTE
          <span className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      {serializedOrganizations.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No organizations available.
        </p>
      ) : (
        <OrganizationsList
          initialOrganizations={serializedOrganizations}
          totalCount={totalCount}
        />
      )}
    </div>
  );
}
