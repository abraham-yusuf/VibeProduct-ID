// ─── components/shared/affiliate-grid.tsx ────────────────────────────────────

import { db } from "@/lib/db"
import { affiliateLinks } from "@/lib/db/schema/affiliate"
import { eq, inArray } from "drizzle-orm"
import { AffiliateCard } from "./affiliate-card"

 interface Props {
   title?: string
   platform?: "shopee" | "tokopedia" | "tiktok_shop"
   tags?: string[]
   limit?: number
 }

 export async function AffiliateGrid({ title, platform, tags, limit = 6 }: Props) {
   const links = await db.query.affiliateLinks.findMany({
     where: eq(affiliateLinks.isActive, true),
     limit,
   })

   if (links.length === 0) return null

   return (
     <div className="space-y-4 my-8 p-5 rounded-xl border border-border/50 bg-muted/20">
       {title && <h3 className="font-semibold text-sm">🛍️ {title}</h3>}
       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
         {links.map((link) => (
           <AffiliateCard key={link.id} link={link} />
         ))}
       </div>
     </div>
   )
}