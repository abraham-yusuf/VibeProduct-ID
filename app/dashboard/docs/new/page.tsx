// ─── app/dashboard/docs/new/page.tsx ───────────────────────────────────────

import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { DocsEditor } from "@/components/dashboard/docs/docs-editor"

interface Props {
  searchParams: { categoryId?: string }
}

export default async function NewDocsPage({ searchParams }: Props) {
  const { categoryId } = searchParams

  // Ambil list kategori untuk dropdown.
  const categories = await db.query.docsCategories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
  })

  // Jika belum ada kategori, user harus buat kategori dulu.
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

