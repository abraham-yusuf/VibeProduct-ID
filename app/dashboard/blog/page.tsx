import Link from "next/link"
import { db } from "@/lib/db"
import { blogPosts, blogCategories } from "@/lib/db/schema/blog"
import { eq, desc, count } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Pencil, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { BlogPostActions } from "@/components/dashboard/blog/blog-post-actions"

export default async function DashboardBlogPage() {
  const [posts, categories, [{ total: totalPosts }]] = await Promise.all([
    db.query.blogPosts.findMany({
      orderBy: [desc(blogPosts.createdAt)],
      with: { category: true },
    }),
    db.select().from(blogCategories),
    db.select({ total: count() }).from(blogPosts),
  ])

  const statusConfig: Record<string, { label: string; class: string }> = {
    draft:     { label: "Draft",      class: "bg-yellow-500/15 text-yellow-400" },
    published: { label: "Published",  class: "bg-green-500/15 text-green-400" },
    scheduled: { label: "Scheduled",  class: "bg-blue-500/15 text-blue-400" },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {totalPosts} artikel · {posts.filter((p) => p.status === "published").length} published
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/blog/categories">Kategori</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/settings/ai">⚙️ Setting AI</Link>
          </Button>
          <Button asChild size="sm" className="gradient-brand text-white hover:opacity-90">
            <Link href="/dashboard/blog/new"><Plus className="w-4 h-4 mr-1.5" /> Tulis Artikel</Link>
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-20 text-center text-muted-foreground">
            Belum ada artikel. Klik "Tulis Artikel" untuk mulai.
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 font-medium">Artikel</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {posts.map((post) => {
                const sc = statusConfig[post.status ?? "draft"]
                return (
                  <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">/{post.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {post.category ? (
                        <Badge variant="outline" className="text-xs">{post.category.name}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${sc.class}`}>{sc.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {post.createdAt ? formatDate(post.createdAt) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                          <Link href={`/dashboard/blog/${post.id}/edit`}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                        {post.status === "published" && (
                          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          </Button>
                        )}
                        <BlogPostActions postId={post.id} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}