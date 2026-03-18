import prisma from "@/lib/db";
import NewsList from "./news-list";

const INITIAL_VISIBLE_COUNT = 15;

export default async function NewsPage() {
  const [news, totalCount] = await Promise.all([
    prisma.newsPost.findMany({
      where: { status: true },
      orderBy: { createdAt: "desc" },
      take: INITIAL_VISIBLE_COUNT,
      select: {
        id: true,
        title: true,
        content: true,
        featuredImage: true,
        createdAt: true,
      },
    }),
    prisma.newsPost.count({
      where: { status: true },
    }),
  ]);

  const serializedNews = news.map((post) => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }));

  return (
    <div className="relative mx-auto my-10 flex max-w-300 flex-col items-start justify-center gap-10 pb-12">
      <div className="mb-8 flex flex-col gap-4 text-center">
        <h1 className="text-3xl font-bold">News</h1>
        <p className="px-30">
          Stay updated with the latest news, announcements, and updates from our
          community. Explore articles, insights, and important events to keep
          yourself informed.
        </p>
      </div>

      {serializedNews.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          No news articles available.
        </p>
      ) : (
        <NewsList initialNews={serializedNews} totalCount={totalCount} />
      )}
    </div>
  );
}
