import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { smmOrders } from "@/lib/db/schema/smm"
import { verifyMidtransSignature } from "@/lib/midtrans"
import { sendNewOrderEmail } from "@/lib/email"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      order_id, transaction_status, fraud_status,
      status_code, gross_amount, signature_key,
    } = body

    // Verifikasi signature
    const valid = verifyMidtransSignature(order_id, status_code, gross_amount, signature_key)
    if (!valid) {
      console.warn("[webhook] Signature tidak valid:", order_id)
      return NextResponse.json({ message: "Invalid signature" }, { status: 403 })
    }

    // Cari order
    const order = await db.query.smmOrders.findFirst({
      where: eq(smmOrders.paymentId, order_id),
      with: { package: { with: { category: true } } },
    })
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Tentukan status baru
    let newStatus: typeof order.status = order.status
    if (transaction_status === "capture" || transaction_status === "settlement") {
      if (fraud_status === "accept" || !fraud_status) newStatus = "paid"
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      newStatus = "cancelled"
    } else if (transaction_status === "refund") {
      newStatus = "refunded"
    }

    if (newStatus !== order.status) {
      await db.update(smmOrders).set({
        status:    newStatus,
        updatedAt: new Date(),
        ...(newStatus === "paid" ? { paidAt: new Date() } : {}),
      }).where(eq(smmOrders.id, order.id))

      // Kirim email notifikasi ke admin saat paid
      if (newStatus === "paid") {
        await sendNewOrderEmail({
          orderId:     order.id,
          paymentId:   order.paymentId!,
          packageName: order.package.name,
          buyerName:   order.buyerName,
          buyerEmail:  order.buyerEmail,
          totalPrice:  order.totalPrice,
          targetUrl:   order.targetUrl,
          quantity:    order.quantity,
        })
      }
    }

    return NextResponse.json({ message: "OK" })
  } catch (e) {
    console.error("[payment-webhook]", e)
    return NextResponse.json({ message: "Internal error" }, { status: 500 })
  }
}