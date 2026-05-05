// ─── app/(public)/docs/layout.tsx ────────────────────────────────────────────
import { db } from "@/lib/db"
import { docsPages } from "@/lib/db/schema/docs"
import { eq } from "drizzle-orm"
import { DocsSidebar } from "@/components/public/docs/docs-sidebar"

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  const categories = await db.query.docsCategories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
    with: {
      pages: {
        where: eq(docsPages.isPublished, true),
        orderBy: (p, { asc }) => [asc(p.sortOrder)],
      },
    },
  })

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        <DocsSidebar categories={categories} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
