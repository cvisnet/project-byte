import type { MetadataRoute } from "next";

function getBaseUrl(): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  return siteUrl ?? "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const lastModified = new Date();

  return [
    { url: `${baseUrl}/`, lastModified },
    { url: `${baseUrl}/courses`, lastModified },
    { url: `${baseUrl}/news`, lastModified },
    { url: `${baseUrl}/organizations`, lastModified },
  ];
}
