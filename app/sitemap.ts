// ─── app/sitemap.ts ───────────────────────────────────────────────────────────
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema/blog"
import { eq } from "drizzle-orm"
import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://vibeproduct.biz.id"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await db
    .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,           lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: `${BASE_URL}/smm`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/wedding`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/ideathon`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/docs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url:              `${BASE_URL}/blog/${p.slug}`,
    lastModified:     p.updatedAt ?? new Date(),
    changeFrequency:  "monthly",
    priority:         0.7,
  }))

  return [...staticPages, ...blogPages]
}