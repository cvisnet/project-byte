import prisma from "@/lib/db";
import { formatContentToHtml } from "@/lib/format-content";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: PageProps) {
  const { id } = await params;

  const post = await prisma.newsPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      featuredImage: true,
      imageGallery: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!post || !post.status) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-6 py-8">
      <Link
        href="/news"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <article>
        <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>

        <time className="mb-6 block text-sm text-muted-foreground">
          Published on{" "}
          {post.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        {post.featuredImage && (
          <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
        )}

        {post.content && (
          <div
            className="prose prose-lg mb-8 max-w-3xl space-y-6 text-justify justify-self-center"
            dangerouslySetInnerHTML={{
              __html: formatContentToHtml(post.content),
            }}
          />
        )}

        {post.imageGallery.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-semibold">Gallery</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {post.imageGallery.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg"
                >
                  <Image
                    src={url}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
