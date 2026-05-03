// ─── app/dashboard/blog/[id]/edit/page.tsx ───────────────────────────────────

import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { blogPosts, blogCategories } from "@/lib/db/schema/blog"
import { eq } from "drizzle-orm"
import { BlogEditor } from "@/components/dashboard/blog/blog-editor"

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
   const [post, categories] = await Promise.all([
     db.query.blogPosts.findFirst({ where: eq(blogPosts.id, params.id) }),
     db.select().from(blogCategories),
   ])
   if (!post) notFound()
   return (
     <div className="space-y-6">
       <h1 className="text-2xl font-bold">Edit Artikel</h1>
       <BlogEditor categories={categories} initialData={post} />
     </div>
   )
}