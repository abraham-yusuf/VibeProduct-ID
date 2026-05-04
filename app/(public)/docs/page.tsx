// ─── app/(public)/docs/page.tsx ──────────────────────────────────────────────
import { db } from "@/lib/db"
import { docsCategories, docsPages } from "@/lib/db/schema/docs"
import { eq } from "drizzle-orm"
import Link from "next/link"
import { FileText, ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dokumentasi",
  description: "Panduan lengkap penggunaan platform Vibe Product ID.",
}

export default async function DocsIndexPage() {
  const categories = await db.query.docsCategories.findMany({
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
    with: {
      pages: {
        where: eq(docsPages.isPublished, true),
        orderBy: (p, { asc }) => [asc(p.sortOrder)],
        limit: 5,
      },
    },
  })

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Dokumentasi Vibe Product ID</h1>
        <p className="text-muted-foreground">
          Panduan lengkap untuk menggunakan semua fitur platform kami.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-xl border border-border/50 p-5 space-y-3 hover:border-primary/40 transition-colors"
          >
            <h2 className="font-semibold">{cat.name}</h2>
            <ul className="space-y-1.5">
              {cat.pages.map((page) => (
                <li key={page.id}>
                  <Link
                    href={`/docs/${page.slug}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
            {cat.pages.length === 5 && (
              <Link
                href={`/docs/${cat.pages[0]?.slug}`}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                Lihat semua <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── app/(public)/docs/[slug]/page.tsx ───────────────────────────────────────
// Simpan sebagai file terpisah

// import { notFound } from "next/navigation"
// import { db } from "@/lib/db"
// import { docsPages } from "@/lib/db/schema/docs"
// import { eq, and } from "drizzle-orm"
// import { AdSlot } from "@/components/shared/ad-slot"
// import type { Metadata } from "next"
//
// interface Props { params: { slug: string } }
//
// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const page = await db.query.docsPages.findFirst({
//     where: and(eq(docsPages.slug, params.slug), eq(docsPages.isPublished, true)),
//   })
//   return page ? { title: `${page.title} — Docs` } : {}
// }
//
// export default async function DocsSlugPage({ params }: Props) {
//   const page = await db.query.docsPages.findFirst({
//     where: and(eq(docsPages.slug, params.slug), eq(docsPages.isPublished, true)),
//     with: { category: true },
//   })
//   if (!page) notFound()
//
//   return (
//     <div className="space-y-8 max-w-2xl">
//       {page.adsenseEnabled && <AdSlot position="header" className="mb-6" />}
//       <div className="space-y-2 pb-6 border-b border-border/30">
//         <p className="text-xs text-muted-foreground uppercase tracking-wide">{page.category?.name}</p>
//         <h1 className="text-3xl font-bold">{page.title}</h1>
//       </div>
//       {page.adsenseEnabled && <AdSlot position="content" className="my-6" />}
//       <article
//         className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-primary"
//         dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
//       />
//       {page.adsenseEnabled && <AdSlot position="footer" className="mt-8" />}
//     </div>
//   )
// }