import Link from "next/link"
import { db } from "@/lib/db"
import { docsCategories, docsPages } from "@/lib/db/schema/docs"
import { DocsDashboardManager } from "@/components/dashboard/docs/docs-manager"

export default async function DashboardDocsPage() {
  const categories = await db.query.docsCategories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
    with: {
      pages: { orderBy: (p, { asc }) => [asc(p.sortOrder)] },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documentation</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {categories.length} kategori · {categories.reduce((acc, c) => acc + c.pages.length, 0)} halaman
          </p>
        </div>
        <Link
          href="/docs"
          target="_blank"
          className="text-xs text-primary hover:underline"
        >
          Lihat Docs Publik →
        </Link>
      </div>
      <DocsDashboardManager categories={categories} />
    </div>
  )
}