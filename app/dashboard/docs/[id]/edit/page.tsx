// ─── app/dashboard/docs/[id]/edit/page.tsx ───────────────────────────────────
// NOTE:
// - Ini halaman untuk edit Docs Page.
// - Mirip halaman create, tapi mengambil `initialData` dari database.

import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { docsPages } from "@/lib/db/schema/docs"
import { eq } from "drizzle-orm"
import { DocsEditor } from "@/components/dashboard/docs/docs-editor"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditDocsPage({ params }: Props) {
  const { id } = await params

  const [categories, page] = await Promise.all([
    db.query.docsCategories.findMany({
      orderBy: (c, { asc }) => [asc(c.sortOrder)],
    }),
    db.query.docsPages.findFirst({
      where: eq(docsPages.id, id),
    }),
  ])

  if (!page) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Halaman Docs</h1>
      <DocsEditor
        categories={categories}
        initialData={{
          id: page.id,
          categoryId: page.categoryId,
          title: page.title,
          slug: page.slug,
          content: page.content ?? "",
          adsenseEnabled: page.adsenseEnabled ?? false,
          sortOrder: page.sortOrder ?? 0,
          isPublished: page.isPublished ?? true,
        }}
      />
    </div>
  )
}

