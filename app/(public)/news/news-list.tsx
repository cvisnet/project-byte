"use client";

import { Button } from "@/components/ui/button";
import { truncateWords } from "@/lib/format-content";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LOAD_MORE_COUNT = 5;

type NewsPost = {
  id: string;
  title: string;
  content: string | null;
  featuredImage: string | null;
  createdAt: string;
};

interface NewsListProps {
  initialNews: NewsPost[];
  totalCount: number;
}

function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link href={`/news/${post.id}`} className="group">
      <article className="h-full overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
        <div className="relative aspect-video bg-muted">
          {post.featuredImage ? (
            <Image
              src={`/api/image-proxy?url=${encodeURIComponent(post.featuredImage)}`}
              alt={post.title}
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

        <div className="p-4">
          <h2 className="line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
            {post.title}
          </h2>
          {post.content && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {truncateWords(post.content, 15)}
            </p>
          )}
          <time className="mt-2 block text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </time>
        </div>
      </article>
    </Link>
  );
}

export default function NewsList({ initialNews, totalCount }: NewsListProps) {
  const [news, setNews] = useState(initialNews);
  const [isLoading, setIsLoading] = useState(false);

  const hasMoreNews = news.length < totalCount;

  const loadMoreNews = async () => {
    if (isLoading || !hasMoreNews) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/news?offset=${news.length}&limit=${LOAD_MORE_COUNT}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load more news.");
      }

      const moreNews: NewsPost[] = await response.json();

      setNews((currentNews) => [...currentNews, ...moreNews]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {news.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>

      {hasMoreNews && (
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={loadMoreNews}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
