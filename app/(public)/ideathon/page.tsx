// ─── app/(public)/ideathon/page.tsx ──────────────────────────────────────────
import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/db"
import { ideathonPosts, ideathonCategories } from "@/lib/db/schema/ideathon"
import { eq, desc } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { AdSlot } from "@/components/shared/ad-slot"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ideathon",
  description: "Kumpulan ide bisnis dan inspirasi digital untuk membantu pertumbuhan usahamu.",
}

export default async function IdeathonPage() {
  const posts = await db.query.ideathonPosts.findMany({
    where: eq(ideathonPosts.isPublished, true),
    orderBy: [desc(ideathonPosts.publishedAt)],
    with: { category: true },
  })

  const embedEmoji: Record<string, string> = {
    youtube: "▶️", tiktok: "🎵", facebook: "👤", instagram: "📸",
  }

  return (
    <div className="container py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-sm font-medium text-primary uppercase tracking-widest">Ideathon</p>
        <h1 className="text-4xl md:text-5xl font-bold">Ide Bisnis & Inspirasi</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Temukan ide-ide bisnis menarik dan konten inspiratif yang dikurasi khusus
          untuk membantu pertumbuhan bisnismu.
        </p>
      </div>

      <AdSlot position="header" />

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Belum ada ide yang dipublikasikan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/ideathon/${post.slug}`}
              className="group flex flex-col rounded-xl border border-border/50 overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              {/* Thumbnail or embed badge */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                {post.thumbnailUrl ? (
                  <Image
                    src={post.thumbnailUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center gradient-brand opacity-10 text-6xl">
                    💡
                  </div>
                )}
                {post.embedType && post.embedType !== "none" && (
                  <div className="absolute top-3 right-3 bg-black/60 rounded-lg px-2 py-1 text-xs text-white font-medium">
                    {embedEmoji[post.embedType]} {post.embedType}
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 space-y-2">
                {post.category && (
                  <Badge variant="outline" className="text-xs">{post.category.name}</Badge>
                )}
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {post.publishedAt ? formatDate(post.publishedAt) : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <AdSlot position="footer" />
    </div>
  )
}