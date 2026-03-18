import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const DEFAULT_LIMIT = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);
  const limit = Math.max(1, Number(searchParams.get("limit")) || DEFAULT_LIMIT);

  const news = await prisma.newsPost.findMany({
    where: { status: true },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
    select: {
      id: true,
      title: true,
      content: true,
      featuredImage: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    news.map((post) => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
    })),
  );
}
