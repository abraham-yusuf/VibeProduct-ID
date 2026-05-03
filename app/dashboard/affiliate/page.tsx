import { db } from "@/lib/db"
import { affiliateLinks } from "@/lib/db/schema/affiliate"
import { AffiliateLinkManager } from "@/components/dashboard/affiliate/affiliate-manager"

export default async function DashboardAffiliatePage() {
  const links = await db
    .select()
    .from(affiliateLinks)
    .orderBy(affiliateLinks.createdAt)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Affiliate Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {links.length} link · {links.filter((l) => l.isActive).length} aktif
        </p>
      </div>
      <AffiliateLinkManager links={links} />
    </div>
  )
}