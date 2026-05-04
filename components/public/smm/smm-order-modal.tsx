"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { orderSchema, type OrderFormInput } from "@/lib/validations/smm"
import { formatRupiah } from "@/lib/utils"
import { MIDTRANS_CLIENT_KEY } from "@/lib/midtrans"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Props {
  pkg: { id: string; name: string; price: number; minQty: number | null; maxQty: number | null }
  open: boolean
  onClose: () => void
}

declare global {
  interface Window { snap: any }
}

export function SmmOrderModal({ pkg, open, onClose }: Props) {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<OrderFormInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: { packageId: pkg.id, quantity: pkg.minQty ?? 100 },
  })

  const qty   = watch("quantity") || 0
  const total = pkg.price * Number(qty)

  async function onSubmit(data: OrderFormInput) {
    setLoading(true)
    const payload = orderSchema.parse(data)
    try {
      const res = await fetch("/api/smm/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error)

      // Load Midtrans Snap script if not loaded
      if (!window.snap) {
        await new Promise<void>((resolve, reject) => {
          const script    = document.createElement("script")
          script.src      = "https://app.sandbox.midtrans.com/snap/snap.js"
          script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY)
          script.onload   = () => resolve()
          script.onerror  = () => reject(new Error("Gagal memuat Midtrans"))
          document.head.appendChild(script)
        })
      }

      onClose()
      window.snap.pay(result.snapToken, {
        onSuccess:   () => toast.success("Pembayaran berhasil! Order sedang diproses."),
        onPending:   () => toast.info("Menunggu pembayaran. Cek email untuk detailnya."),
        onError:     () => toast.error("Pembayaran gagal. Silakan coba lagi."),
        onClose:     () => toast.warning("Kamu menutup halaman pembayaran."),
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan. Coba lagi."
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pesan — {pkg.name}</DialogTitle>
          <DialogDescription>
            Harga: {formatRupiah(pkg.price)} / item ·{" "}
            Min {(pkg.minQty ?? 100).toLocaleString("id-ID")} item
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <input type="hidden" {...register("packageId")} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Nama Lengkap</Label>
              <Input placeholder="Budi Santoso" {...register("buyerName")} />
              {errors.buyerName && <p className="text-xs text-destructive">{errors.buyerName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>No. HP / WhatsApp</Label>
              <Input placeholder="08xxxxxxxxxx" {...register("buyerPhone")} />
              {errors.buyerPhone && <p className="text-xs text-destructive">{errors.buyerPhone.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" placeholder="email@kamu.com" {...register("buyerEmail")} />
            {errors.buyerEmail && <p className="text-xs text-destructive">{errors.buyerEmail.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Username / URL Target</Label>
            <Input placeholder="@username atau https://..." {...register("targetUrl")} />
            {errors.targetUrl && <p className="text-xs text-destructive">{errors.targetUrl.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Jumlah (Min: {(pkg.minQty ?? 100).toLocaleString("id-ID")})</Label>
            <Input
              type="number"
              min={pkg.minQty ?? 100}
              max={pkg.maxQty ?? 100000}
              {...register("quantity")}
            />
            {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Catatan (opsional)</Label>
            <Textarea placeholder="Catatan tambahan..." rows={2} {...register("notes")} />
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-4 py-3">
            <span className="text-sm text-muted-foreground">Total Pembayaran</span>
            <span className="text-xl font-bold gradient-brand-text">{formatRupiah(total)}</span>
          </div>

          <Button type="submit" disabled={loading} className="w-full gradient-brand text-white hover:opacity-90 h-11">
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</> : "Bayar Sekarang"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}