import type { MetadataRoute } from "next";

const siteUrl = "https://tanzania-business-os.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/app/", "/login", "/forgot-password", "/reset-password"] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
