// ─── app/dashboard/ideathon/[id]/edit/page.tsx ───────────────────────────────
// NOTE:
// - Ini halaman untuk edit Ideathon Post.
// - Mirip `app/dashboard/ideathon/new/page.tsx`, tapi mengambil `initialData`.

import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ideathonPosts, ideathonCategories } from "@/lib/db/schema/ideathon"
import { affiliateLinks } from "@/lib/db/schema/affiliate"
import { and, eq } from "drizzle-orm"
import { IdeathonEditor } from "@/components/dashboard/ideathon/ideathon-editor"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditIdeathonPage({ params }: Props) {
  const { id } = await params

  const [categories, affiliates, post] = await Promise.all([
    db.select().from(ideathonCategories),
    db.select().from(affiliateLinks).where(eq(affiliateLinks.isActive, true)),
    db.query.ideathonPosts.findFirst({
      where: eq(ideathonPosts.id, id),
    }),
  ])

  if (!post) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Ide</h1>
      <IdeathonEditor
        categories={categories}
        affiliates={affiliates}
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content ?? "",
          thumbnailUrl: post.thumbnailUrl,
          categoryId: post.categoryId,
          tags: post.tags,
          embedUrl: post.embedUrl,
          embedType: post.embedType,
          adsenseEnabled: post.adsenseEnabled,
          isPublished: post.isPublished,
        }}
      />
    </div>
  )
}

