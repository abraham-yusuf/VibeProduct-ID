import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { smmOrders, smmPackages } from "@/lib/db/schema/smm"
import { orderSchema } from "@/lib/validations/smm"
import { createSnapToken } from "@/lib/midtrans"
import { eq } from "drizzle-orm"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const input  = orderSchema.parse(body)

    // Ambil data paket
    const pkg = await db.query.smmPackages.findFirst({
      where: eq(smmPackages.id, input.packageId),
      with: { category: true },
    })
    if (!pkg || !pkg.isActive) {
      return NextResponse.json({ error: "Paket tidak tersedia" }, { status: 404 })
    }

    // Validasi quantity
    if (input.quantity < (pkg.minQty ?? 1) || input.quantity > (pkg.maxQty ?? 100000)) {
      return NextResponse.json(
        { error: `Jumlah harus antara ${pkg.minQty} – ${pkg.maxQty}` },
        { status: 400 }
      )
    }

    const totalPrice = pkg.price * input.quantity
    const paymentId  = `VPD-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`

    // Buat snap token Midtrans
    const snapToken = await createSnapToken({
      orderId:     paymentId,
      amount:      totalPrice,
      buyerName:   input.buyerName,
      buyerEmail:  input.buyerEmail,
      buyerPhone:  input.buyerPhone,
      packageName: pkg.name,
    })

    // Simpan order ke DB
    const [order] = await db.insert(smmOrders).values({
      packageId:   input.packageId,
      buyerName:   input.buyerName,
      buyerEmail:  input.buyerEmail,
      buyerPhone:  input.buyerPhone,
      targetUrl:   input.targetUrl,
      quantity:    input.quantity,
      totalPrice,
      paymentId,
      snapToken,
      notes:       input.notes,
      status:      "pending",
    }).returning()

    return NextResponse.json({ orderId: order.id, paymentId, snapToken, totalPrice })
  } catch (e: any) {
    console.error("[create-order]", e)
    if (e.name === "ZodError") {
      return NextResponse.json({ error: e.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}