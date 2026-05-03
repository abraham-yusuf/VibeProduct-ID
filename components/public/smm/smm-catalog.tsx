"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmmPackageCard } from "./smm-package-card"
import { SmmOrderModal } from "./smm-order-modal"

interface Package {
  id: string; name: string; description: string | null
  price: number; minQty: number | null; maxQty: number | null
}
interface Category {
  id: string; name: string; platform: string; icon: string | null
  packages: Package[]
}

const platformEmoji: Record<string, string> = {
  instagram: "📸", tiktok: "🎵", youtube: "▶️",
  twitter: "🐦", facebook: "👤", telegram: "✈️", spotify: "🎧",
}

export function SmmCatalog({ categories }: { categories: Category[] }) {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null)

  if (categories.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Belum ada paket tersedia. Silakan cek kembali nanti.
      </div>
    )
  }

  return (
    <>
      <Tabs defaultValue={categories[0]?.id}>
        <TabsList className="flex flex-wrap h-auto gap-2 bg-muted/50 p-2 rounded-xl mb-8">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {platformEmoji[cat.platform] ?? "📦"} {cat.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id}>
            {cat.packages.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                Belum ada paket di kategori ini.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.packages.map((pkg) => (
                  <SmmPackageCard
                    key={pkg.id}
                    pkg={pkg}
                    platform={cat.platform}
                    onOrder={() => setSelectedPkg(pkg)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {selectedPkg && (
        <SmmOrderModal
          pkg={selectedPkg}
          open={!!selectedPkg}
          onClose={() => setSelectedPkg(null)}
        />
      )}
    </>
  )
}