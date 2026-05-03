"use client"

import { useState, useTransition } from "react"
import { updateOrderStatus } from "@/lib/actions/smm"
import { formatRupiah, formatDatetime } from "@/lib/utils"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ExternalLink } from "lucide-react"
import { toast } from "sonner"

type Order = {
  id: string; buyerName: string; buyerEmail: string; buyerPhone: string
  targetUrl: string; quantity: number; totalPrice: number
  status: string | null; paymentId: string | null; notes: string | null
  adminNotes: string | null; createdAt: Date | null
  package: { name: string; category: { platform: string } }
}

const statusConfig: Record<string, { label: string; class: string }> = {
  pending:    { label: "Pending",     class: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  paid:       { label: "Dibayar",     class: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  processing: { label: "Diproses",    class: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  completed:  { label: "Selesai",     class: "bg-green-500/15 text-green-400 border-green-500/20" },
  failed:     { label: "Gagal",       class: "bg-red-500/15 text-red-400 border-red-500/20" },
  cancelled:  { label: "Dibatalkan",  class: "bg-gray-500/15 text-gray-400 border-gray-500/20" },
  refunded:   { label: "Direfund",    class: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition()
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [adminNotes, setAdminNotes]   = useState("")

  function handleUpdateStatus(
    id: string,
    status: "processing" | "completed" | "failed" | "cancelled" | "refunded"
  ) {
    startTransition(async () => {
      const res = await updateOrderStatus(id, status, adminNotes || undefined)
      if (res.success) toast.success("Status order diperbarui")
      else toast.error(res.error)
    })
  }

  return (
    <>
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Pembeli</TableHead>
              <TableHead>Paket</TableHead>
              <TableHead>Target</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                  Belum ada order
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => {
                const sc = statusConfig[o.status ?? "pending"]
                return (
                  <TableRow key={o.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{o.buyerName}</p>
                        <p className="text-xs text-muted-foreground">{o.buyerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{o.package.name}</TableCell>
                    <TableCell>
                      <a
                        href={o.targetUrl.startsWith("http") ? o.targetUrl : `https://${o.targetUrl}`}
                        target="_blank" rel="noopener noreferrer"
                        className="text-sm text-primary flex items-center gap-1 hover:underline"
                      >
                        {o.targetUrl.length > 20 ? o.targetUrl.slice(0, 20) + "…" : o.targetUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {o.quantity.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {formatRupiah(o.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${sc?.class}`}>
                        {sc?.label ?? o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {o.createdAt ? formatDatetime(o.createdAt) : "-"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpdateStatus(o.id, "processing")}>
                            🔄 Tandai Diproses
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(o.id, "completed")}>
                            ✅ Tandai Selesai
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(o.id, "failed")}>
                            ❌ Tandai Gagal
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(o.id, "cancelled")}>
                            🚫 Batalkan
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setDetailOrder(o); setAdminNotes(o.adminNotes ?? "") }}>
                            📋 Detail & Catatan
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail modal */}
      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Order</DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2 bg-muted/30 rounded-lg p-4">
                {[
                  ["Pembeli", detailOrder.buyerName],
                  ["Email", detailOrder.buyerEmail],
                  ["HP", detailOrder.buyerPhone],
                  ["Paket", detailOrder.package.name],
                  ["Target", detailOrder.targetUrl],
                  ["Jumlah", detailOrder.quantity.toLocaleString("id-ID")],
                  ["Total", formatRupiah(detailOrder.totalPrice)],
                  ["Payment ID", detailOrder.paymentId ?? "-"],
                ].map(([k, v]) => (
                  <><span key={k} className="text-muted-foreground">{k}</span><span key={v} className="font-medium">{v}</span></>
                ))}
              </div>
              {detailOrder.notes && (
                <div>
                  <p className="text-muted-foreground mb-1">Catatan Pembeli:</p>
                  <p className="bg-muted/30 rounded p-3">{detailOrder.notes}</p>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Catatan Admin</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Tambahkan catatan internal..."
                  rows={3}
                />
              </div>
              <Button
                className="w-full gradient-brand text-white hover:opacity-90"
                disabled={isPending}
                onClick={() => {
                  handleUpdateStatus(detailOrder.id, "processing")
                  setDetailOrder(null)
                }}
              >
                Simpan Catatan & Tandai Diproses
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}