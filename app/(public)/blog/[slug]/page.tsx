import { notFound } from "next/navigation"
import Image from "next/image"
import { db } from "@/lib/db"
import { blogPosts } from "@/lib/db/schema/blog"
import { eq, and } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { AdSlot } from "@/components/shared/ad-slot"
import { formatDate } from "@/lib/utils"
import type { Metadata } from "next"

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await db.query.blogPosts.findFirst({
    where: and(eq(blogPosts.slug, params.slug), eq(blogPosts.status, "published")),
  })
  if (!post) return {}
  return {
    title:       post.metaTitle ?? post.title,
    description: post.metaDesc ?? post.excerpt ?? undefined,
    openGraph: {
      title:       post.metaTitle ?? post.title,
      description: post.metaDesc ?? post.excerpt ?? undefined,
      images:      post.ogImage ? [post.ogImage] : post.thumbnailUrl ? [post.thumbnailUrl] : [],
    },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await db.query.blogPosts.findFirst({
    where: and(eq(blogPosts.slug, params.slug), eq(blogPosts.status, "published")),
    with: { category: true },
  })
  if (!post) notFound()

  return (
    <div className="container py-12 max-w-3xl">
      {/* Adsense — top */}
      {post.adsenseEnabled && <AdSlot position="header" className="mb-8" />}

      {/* Header */}
      <div className="space-y-4 mb-8">
        {post.category && (
          <Badge variant="outline">{post.category.name}</Badge>
        )}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
        {post.excerpt && (
          <p className="text-muted-foreground text-lg leading-relaxed">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Vibe Product ID</span>
          <span>·</span>
          <span>{post.publishedAt ? formatDate(post.publishedAt) : ""}</span>
        </div>
      </div>

      {/* Thumbnail */}
      {post.thumbnailUrl && (
        <div className="aspect-video relative rounded-xl overflow-hidden mb-8">
          <Image
            src={post.thumbnailUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Adsense — in content (after image) */}
      {post.adsenseEnabled && <AdSlot position="content" className="mb-8" />}

      {/* Content */}
      <article
        className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border/30">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}

      {/* Adsense — footer */}
      {post.adsenseEnabled && <AdSlot position="footer" className="mt-10" />}
    </div>
  )
}