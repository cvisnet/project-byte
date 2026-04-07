import prisma from "@/lib/db";
import { formatContentToHtml } from "@/lib/format-content";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

  // Return 404 if post not found or not published
  if (!post || !post.status) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back link */}
      <Link
        href="/news"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        &larr; Back to News
      </Link>

      <article>
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {/* Date */}
        <time className="block text-sm text-muted-foreground mb-6">
          Published on {post.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
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

        {/* Content with paragraphs */}
        {post.content && (
          <h2
            className="prose prose-lg max-w-none mb-8 mx-12 text-justify space-y-6"
            dangerouslySetInnerHTML={{
              __html: formatContentToHtml(post.content),
            }}
          />
        )}

        {/* Image Gallery */}
        {post.imageGallery.length > 0 && (
          <section className="mt-12">
            <h1 className="text-2xl font-semibold mb-4">Gallery</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {post.imageGallery.map((url, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={url}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
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
