import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);
  const limit = Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT);

  const organizations = await prisma.organization.findMany({
    orderBy: { trainingStartedAt: "desc" },
    skip: offset,
    take: limit,
    select: {
      id: true,
      acronym: true,
      name: true,
      location: true,
      profilePhoto: true,
      trainingStartedAt: true,
    },
  });

  return NextResponse.json(
    organizations.map((org) => ({
      ...org,
      trainingStartedAt: org.trainingStartedAt.toISOString(),
    })),
  );
}
