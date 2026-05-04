// ─── app/dashboard/docs/new/page.tsx ─────────────────────────────────────────
// NOTE:
// - Ini halaman untuk membuat Docs Page baru.
// - Strukturnya sengaja mirip `app/dashboard/blog/new/page.tsx`,
//   tapi menggunakan `DocsEditor`.

import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { docsCategories } from "@/lib/db/schema/docs"
import { DocsEditor } from "@/components/dashboard/docs/docs-editor"

interface Props {
  searchParams: Promise<{ categoryId?: string }>
}

export default async function NewDocsPage({ searchParams }: Props) {
  const { categoryId } = await searchParams

  const categories = await db.query.docsCategories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  })

  // Jika belum ada kategori, arahkan user untuk buat kategori dulu.
  if (categories.length === 0) {
    redirect("/dashboard/docs")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tambah Halaman Docs</h1>
      <DocsEditor
        categories={categories}
        initialCategoryId={categoryId}
      />
    </div>
  )
}

