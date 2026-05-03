import { db } from "@/lib/db"
import { weddingThemes } from "@/lib/db/schema/wedding"
import { WeddingThemeManager } from "@/components/dashboard/wedding/theme-manager"

export default async function DashboardWeddingPage() {
  const themes = await db
    .select()
    .from(weddingThemes)
    .orderBy(weddingThemes.sortOrder)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wedding Invitation</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {themes.length} tema · {themes.filter((t) => t.isActive).length} aktif
          </p>
        </div>
      </div>

      <WeddingThemeManager themes={themes} />
    </div>
  )
}