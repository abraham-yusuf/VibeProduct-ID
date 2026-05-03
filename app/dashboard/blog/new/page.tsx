// ─── app/dashboard/blog/new/page.tsx ─────────────────────────────────────────
import { db } from "@/lib/db"
import { blogCategories } from "@/lib/db/schema/blog"
import { BlogEditor } from "@/components/dashboard/blog/blog-editor"

export default async function NewBlogPostPage() {
  const categories = await db.select().from(blogCategories)
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tulis Artikel Baru</h1>
      <BlogEditor categories={categories} />
    </div>
  )
}