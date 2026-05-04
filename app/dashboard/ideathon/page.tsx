import Link from "next/link"
import { db } from "@/lib/db"
import { ideathonPosts } from "@/lib/db/schema/ideathon"
import { desc } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { IdeathonPostActions } from "@/components/dashboard/ideathon/ideathon-post-actions"

export default async function DashboardIdeathonPage() {
  const posts = await db.query.ideathonPosts.findMany({
    orderBy: [desc(ideathonPosts.createdAt)],
    with: { category: true },
  })

  const embedEmoji: Record<string, string> = {
    youtube: "▶️", tiktok: "🎵", facebook: "👤", instagram: "📸", none: "📝",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ideathon</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {posts.length} ide · {posts.filter((p) => p.isPublished).length} published
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/ideathon/categories">Kategori</Link>
          </Button>
          <Button asChild size="sm" className="gradient-brand text-white hover:opacity-90">
            <Link href="/dashboard/ideathon/new">
              <Plus className="w-4 h-4 mr-1.5" /> Tambah Ide
            </Link>
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-border/50 py-20 text-center text-muted-foreground">
          Belum ada ide. Klik "Tambah Ide" untuk mulai.
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="px-4 py-3 font-medium">Judul</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Embed</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 w-28" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">/{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {post.category
                      ? <Badge variant="outline" className="text-xs">{post.category.name}</Badge>
                      : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-base">
                    {embedEmoji[post.embedType ?? "none"]}
                    <span className="text-xs text-muted-foreground ml-1 capitalize">
                      {post.embedType !== "none" ? post.embedType : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={post.isPublished
                      ? "bg-green-500/15 text-green-400 text-xs"
                      : "bg-yellow-500/15 text-yellow-400 text-xs"
                    }>
                      {post.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {post.createdAt ? formatDate(post.createdAt) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                        <Link href={`/dashboard/ideathon/${post.id}/edit`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      {post.isPublished && (
                        <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                          <Link href={`/ideathon/${post.slug}`} target="_blank">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </Button>
                      )}
                      <IdeathonPostActions postId={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}