import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ideathonPosts } from "@/lib/db/schema/ideathon"
import { eq, and } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { AdSlot } from "@/components/shared/ad-slot"
import { VideoEmbed } from "@/components/shared/video-embed"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await db.query.ideathonPosts.findFirst({
    where: and(eq(ideathonPosts.slug, params.slug), eq(ideathonPosts.isPublished, true)),
  })
  if (!post) return {}
  return {
    title:       post.title,
    description: `Ide bisnis: ${post.title} — Vibe Product ID`,
    openGraph:   { title: post.title, images: post.thumbnailUrl ? [post.thumbnailUrl] : [] },
  }
}

export default async function IdeathonDetailPage({ params }: Props) {
  const post = await db.query.ideathonPosts.findFirst({
    where: and(eq(ideathonPosts.slug, params.slug), eq(ideathonPosts.isPublished, true)),
    with: { category: true },
  })
  if (!post) notFound()

  return (
    <div className="container py-12 max-w-3xl">
      {post.adsenseEnabled && <AdSlot position="header" className="mb-8" />}

      {/* Header */}
      <div className="space-y-4 mb-8">
        {post.category && <Badge variant="outline">{post.category.name}</Badge>}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
        <p className="text-sm text-muted-foreground">
          {post.publishedAt ? formatDate(post.publishedAt) : ""}
        </p>
      </div>

      {/* Embed video — shown before content */}
      {post.embedUrl && post.embedType && post.embedType !== "none" && (
        <div className="mb-8">
          <VideoEmbed url={post.embedUrl} type={post.embedType as any} />
        </div>
      )}

      {post.adsenseEnabled && <AdSlot position="content" className="mb-8" />}

      {/* Content */}
      {post.content && (
        <article
          className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border/30">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}

      {post.adsenseEnabled && <AdSlot position="footer" className="mt-10" />}
    </div>
  )
}