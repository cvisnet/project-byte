import type { MetadataRoute } from "next";

function getBaseUrl(): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  return siteUrl ?? "http://localhost:3000";
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/dashboard",
          "/news-management",
          "/organization-management",
          "/users",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
