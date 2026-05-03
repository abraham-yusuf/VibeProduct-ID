import Link from "next/link"
import { db } from "@/lib/db"
import { smmOrders, smmPackages, smmCategories } from "@/lib/db/schema/smm"
import { eq, count, sum } from "drizzle-orm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingBag, DollarSign, Clock, ArrowRight } from "lucide-react"
import { formatRupiah } from "@/lib/utils"

export default async function DashboardSmmPage() {
  const [
    [{ total: totalPackages }],
    [{ total: totalOrders }],
    [{ total: pendingOrders }],
    revenueResult,
  ] = await Promise.all([
    db.select({ total: count() }).from(smmPackages),
    db.select({ total: count() }).from(smmOrders),
    db.select({ total: count() }).from(smmOrders).where(eq(smmOrders.status, "paid")),
    db.select({ total: sum(smmOrders.totalPrice) }).from(smmOrders).where(eq(smmOrders.status, "completed")),
  ])

  const totalRevenue = Number(revenueResult[0]?.total ?? 0)

  const stats = [
    { label: "Total Paket Aktif", value: totalPackages, icon: Package, color: "text-violet-400" },
    { label: "Total Order", value: totalOrders, icon: ShoppingBag, color: "text-blue-400" },
    { label: "Menunggu Proses", value: pendingOrders, icon: Clock, color: "text-amber-400" },
    { label: "Total Pendapatan", value: formatRupiah(totalRevenue), icon: DollarSign, color: "text-green-400" },
  ]

  const recentOrders = await db.query.smmOrders.findMany({
    orderBy: (o, { desc }) => [desc(o.createdAt)],
    limit: 5,
    with: { package: true },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SMM Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola paket dan order sosial media</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/smm/categories">Kategori</Link>
          </Button>
          <Button asChild size="sm" className="gradient-brand text-white hover:opacity-90">
            <Link href="/dashboard/smm/packages/new">+ Paket Baru</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent orders */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Order Terbaru</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/smm/orders">Lihat Semua <ArrowRight className="w-3 h-3 ml-1" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada order masuk.</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{o.buyerName}</p>
                    <p className="text-xs text-muted-foreground">{o.package.name} · {o.quantity.toLocaleString("id-ID")} item</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatRupiah(o.totalPrice)}</p>
                    <StatusBadge status={o.status ?? "pending"} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:    "bg-yellow-500/15 text-yellow-400",
    paid:       "bg-blue-500/15 text-blue-400",
    processing: "bg-violet-500/15 text-violet-400",
    completed:  "bg-green-500/15 text-green-400",
    failed:     "bg-red-500/15 text-red-400",
    cancelled:  "bg-gray-500/15 text-gray-400",
    refunded:   "bg-orange-500/15 text-orange-400",
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? ""}`}>
      {status}
    </span>
  )
}