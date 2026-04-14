"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";


interface LatestNewsClientProps {
  news: {
    id: string;
    title: string;
    content: string | null;
    featuredImage: string | null;
    createdAt: Date;
  }[];
}

export default function LatestNewsClient({ news }: LatestNewsClientProps) {
  const items = news.map((news) => ({
    image: news.featuredImage || "/images/placeholder.jpg",
    title: news.title,
    description: news.content ?? "",
    link: `/news/${news.id}`,
  }));

  return (
    <div className="relative mx-auto my-10 flex max-w-[96rem] flex-col items-center justify-center gap-4 px-8 py-20">
      <div className="flex flex-col gap-4 items-center mb-6">
        <h1 className="text-4xl font-bold text-brand-blue lg:text-5xl">
          Latest <span className="text-[#edd153]">News</span>
        </h1>
        <p className="text-center max-w-2xl text-muted-foreground">
          Stay updated with the latest announcements, activities, and
          developments from the BYTE community.
        </p>
      </div>

      <HoverEffect items={items} />

      <a
        href="/news"
        className="group inline-flex w-fit items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-brand-blue-light"
      >
        Read More News
        <span className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </a>
    </div>
  );
}
