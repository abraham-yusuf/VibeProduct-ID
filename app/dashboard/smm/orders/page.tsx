import { db } from "@/lib/db"
import { smmOrders } from "@/lib/db/schema/smm"
import { OrdersTable } from "@/components/dashboard/smm/orders-table"
import { formatRupiah, formatDatetime } from "@/lib/utils"

export default async function OrdersPage() {
  const orders = await db.query.smmOrders.findMany({
    orderBy: (o, { desc }) => [desc(o.createdAt)],
    with: { package: { with: { category: true } } },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daftar Order</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Total {orders.length} order · Klik baris untuk update status
        </p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  )
}