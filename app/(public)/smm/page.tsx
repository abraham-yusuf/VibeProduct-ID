import { db } from "@/lib/db"
import { smmCategories, smmPackages } from "@/lib/db/schema/smm"
import { eq, and } from "drizzle-orm"
import { SmmCatalog } from "@/components/public/smm/smm-catalog"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "SMM Panel",
  description: "Tingkatkan followers, likes, dan views sosial media dengan harga terjangkau.",
}

export default async function SmmPage() {
  const categories = await db.query.smmCategories.findMany({
    where: eq(smmCategories.isActive, true),
    orderBy: (c, { asc }) => [asc(c.sortOrder)],
    with: {
      packages: {
        where: eq(smmPackages.isActive, true),
        orderBy: (p, { asc }) => [asc(p.sortOrder)],
      },
    },
  })

  return (
    <div className="container py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-sm font-medium text-primary uppercase tracking-widest">SMM Panel</p>
        <h1 className="text-4xl md:text-5xl font-bold">Paket Sosial Media</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Pilih paket yang sesuai kebutuhanmu. Proses cepat, harga terjangkau, dan aman.
        </p>
      </div>

      <SmmCatalog categories={categories} />
    </div>
  )
}