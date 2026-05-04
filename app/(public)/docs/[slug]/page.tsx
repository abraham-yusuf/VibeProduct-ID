// ─── app/(public)/docs/[slug]/page.tsx ─────────────────────────────────────

import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { and, eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { docsPages } from "@/lib/db/schema/docs"
import { AdSlot } from "@/components/shared/ad-slot"

interface Props {
  params: { slug: string }
}

// Generate metadata untuk SEO (title) berdasarkan halaman docs.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await db.query.docsPages.findFirst({
    where: and(eq(docsPages.slug, params.slug), eq(docsPages.isPublished, true)),
  })

  return page ? { title: `${page.title} — Docs` } : {}
}

export default async function DocsSlugPage({ params }: Props) {
  // Ambil data halaman docs by slug.
  // - Hanya yang published
  // - include relasi category untuk breadcrumb kecil di atas judul
  const page = await db.query.docsPages.findFirst({
    where: and(eq(docsPages.slug, params.slug), eq(docsPages.isPublished, true)),
    with: { category: true },
  })

  // Jika tidak ditemukan, lempar 404.
  if (!page) notFound()

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Optional ads */}
      {page.adsenseEnabled && <AdSlot position="header" className="mb-6" />}

      <div className="space-y-2 pb-6 border-b border-border/30">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {page.category?.name}
        </p>
        <h1 className="text-3xl font-bold">{page.title}</h1>
      </div>

      {page.adsenseEnabled && <AdSlot position="content" className="my-6" />}

      {/*
        NOTE:
        `page.content` diasumsikan sudah HTML.
        Kalau nanti source kamu berupa markdown/MDX, kamu perlu renderer.
      */}
      <article
        className="prose prose-invert max-w-none prose-headings:font-bold prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: page.content ?? "" }}
      />

      {page.adsenseEnabled && <AdSlot position="footer" className="mt-8" />}
    </div>
  )
}

