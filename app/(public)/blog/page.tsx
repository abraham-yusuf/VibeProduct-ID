import Link from "next/link"
import Image from "next/image"
import { db } from "@/lib/db"
import { blogPosts, blogCategories } from "@/lib/db/schema/blog"
import { eq, desc } from "drizzle-orm"
import { Badge } from "@/components/ui/badge"
import { AdSlot } from "@/components/shared/ad-slot"
import { formatDate, truncate } from "@/lib/utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Artikel seputar digital marketing, bisnis online, dan tips berguna lainnya.",
}

export default async function BlogPage() {
  const posts = await db.query.blogPosts.findMany({
    where: eq(blogPosts.status, "published"),
    orderBy: [desc(blogPosts.publishedAt)],
    with: { category: true },
  })

  const [featured, ...rest] = posts

  return (
    <div className="container py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-sm font-medium text-primary uppercase tracking-widest">Blog</p>
        <h1 className="text-4xl md:text-5xl font-bold">Artikel & Tips Digital</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Temukan wawasan terbaru seputar digital marketing, bisnis online, dan tips berguna
          dari Vibe Product ID.
        </p>
      </div>

      {/* Adsense — header */}
      <AdSlot position="header" />

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          Belum ada artikel. Nantikan konten menarik dari kami!
        </div>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-primary/5">
                <div className="aspect-[2/1] bg-muted relative">
                  {featured.thumbnailUrl ? (
                    <Image
                      src={featured.thumbnailUrl}
                      alt={featured.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 gradient-brand opacity-20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    {featured.category && (
                      <Badge className="mb-3 bg-primary/80 text-white border-0">
                        {featured.category.name}
                      </Badge>
                    )}
                    <h2 className="text-xl md:text-3xl font-bold text-white line-clamp-2">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-white/70 mt-2 text-sm md:text-base line-clamp-2">
                        {featured.excerpt}
                      </p>
                    )}
                    <p className="text-white/50 text-xs mt-3">
                      {featured.publishedAt ? formatDate(featured.publishedAt) : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid articles */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-xl border border-border/50 overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {post.thumbnailUrl ? (
                      <Image
                        src={post.thumbnailUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center gradient-brand opacity-15 text-5xl">
                        ✍️
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
                    {post.excerpt && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                    <p className="text-xs text-muted-foreground pt-1">
                      {post.publishedAt ? formatDate(post.publishedAt) : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* Adsense — footer */}
      <AdSlot position="footer" />
    </div>
  )
}