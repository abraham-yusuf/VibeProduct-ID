// ─── lib/email/index.ts ───────────────────────────────────────────────────────
import { Resend } from "resend"
import { formatRupiah } from "@/lib/utils"

const resend = new Resend(process.env.RESEND_API_KEY)

interface NewOrderParams {
  orderId:     string
  paymentId:   string
  packageName: string
  buyerName:   string
  buyerEmail:  string
  totalPrice:  number
  targetUrl:   string
  quantity:    number
}

export async function sendNewOrderEmail(params: NewOrderParams) {
  try {
    await resend.emails.send({
      from:    `Vibe Product ID <${process.env.RESEND_FROM_EMAIL}>`,
      to:      [process.env.ADMIN_EMAIL!],
      subject: `🛒 Order Baru! ${params.packageName} — ${formatRupiah(params.totalPrice)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px;">
          <h2 style="color: #7c3aed;">🎉 Order Baru Masuk!</h2>
          <table style="width:100%; border-collapse:collapse; margin-top:16px;">
            <tr><td style="padding:8px 0; color:#6b7280;">Order ID</td><td style="padding:8px 0; font-weight:600;">${params.orderId.slice(0, 8).toUpperCase()}</td></tr>
            <tr><td style="padding:8px 0; color:#6b7280;">Payment ID</td><td style="padding:8px 0;">${params.paymentId}</td></tr>
            <tr><td style="padding:8px 0; color:#6b7280;">Paket</td><td style="padding:8px 0; font-weight:600;">${params.packageName}</td></tr>
            <tr><td style="padding:8px 0; color:#6b7280;">Jumlah</td><td style="padding:8px 0;">${params.quantity.toLocaleString("id-ID")}</td></tr>
            <tr><td style="padding:8px 0; color:#6b7280;">Target</td><td style="padding:8px 0;">${params.targetUrl}</td></tr>
            <tr><td style="padding:8px 0; color:#6b7280;">Pembeli</td><td style="padding:8px 0;">${params.buyerName} (${params.buyerEmail})</td></tr>
            <tr><td style="padding:8px 0; color:#6b7280;">Total</td><td style="padding:8px 0; font-weight:700; color:#7c3aed; font-size:18px;">${formatRupiah(params.totalPrice)}</td></tr>
          </table>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/smm/orders"
             style="display:inline-block; margin-top:24px; padding:12px 24px; background:#7c3aed; color:white; text-decoration:none; border-radius:8px; font-weight:600;">
            Lihat di Dashboard →
          </a>
          <p style="margin-top:24px; color:#9ca3af; font-size:12px;">Vibe Product ID · vibeproduct.biz.id</p>
        </div>
      `,
    })
  } catch (e) {
    // Jangan throw — email gagal tidak boleh block proses utama
    console.error("[sendNewOrderEmail]", e)
  }
}