import { db } from "@/lib/db"
import { ideathonCategories } from "@/lib/db/schema/ideathon"
import { affiliateLinks } from "@/lib/db/schema/affiliate"
import { eq } from "drizzle-orm"
import { IdeathonEditor } from "@/components/dashboard/ideathon/ideathon-editor"

export default async function NewIdeathonPage() {
  const [categories, affiliates] = await Promise.all([
    db.select().from(ideathonCategories),
    db.select().from(affiliateLinks).where(eq(affiliateLinks.isActive, true)),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tambah Ide Baru</h1>
      <IdeathonEditor categories={categories} affiliates={affiliates} />
    </div>
  )
}