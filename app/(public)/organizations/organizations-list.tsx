"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LOAD_MORE_COUNT = 5;

type Organization = {
  id: string;
  acronym: string | null;
  name: string;
  location: string | null;
  profilePhoto: string | null;
  trainingStartedAt: string;
};

interface OrganizationsListProps {
  initialOrganizations: Organization[];
  totalCount: number;
}

function OrganizationCard({ org }: { org: Organization }) {
  return (
    <Link href={`/organizations/${org.id}`} className="group block h-full w-full">
      <article className="flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
        <div className="relative aspect-video bg-muted">
          {org.profilePhoto ? (
            <Image
              src={org.profilePhoto}
              alt={org.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h2 className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
            {org.acronym ? org.acronym : org.name}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">{org.location}</p>
          <time className="mt-auto pt-4 text-right text-xs text-muted-foreground">
            {new Date(org.trainingStartedAt).toLocaleDateString()}
          </time>
        </div>
      </article>
    </Link>
  );
}

export default function OrganizationsList({
  initialOrganizations,
  totalCount,
}: OrganizationsListProps) {
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [isLoading, setIsLoading] = useState(false);

  const hasMoreOrganizations = organizations.length < totalCount;

  const loadMoreOrganizations = async () => {
    if (isLoading || !hasMoreOrganizations) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/organizations?offset=${organizations.length}&limit=${LOAD_MORE_COUNT}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load more organizations.");
      }

      const moreOrganizations: Organization[] = await response.json();

      setOrganizations((currentOrganizations) => [
        ...currentOrganizations,
        ...moreOrganizations,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {organizations.map((org) => (
          <OrganizationCard key={org.id} org={org} />
        ))}
      </div>

      {hasMoreOrganizations && (
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={loadMoreOrganizations}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
