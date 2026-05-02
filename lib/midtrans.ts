import { formatRupiah } from "@/lib/utils"

const SERVER_KEY  = process.env.MIDTRANS_SERVER_KEY!
const IS_PROD     = process.env.MIDTRANS_IS_PRODUCTION === "true"
const BASE_URL    = IS_PROD
  ? "https://app.midtrans.com/snap/v1"
  : "https://app.sandbox.midtrans.com/snap/v1"

export const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY!

interface SnapTokenParams {
  orderId:     string
  amount:      number
  buyerName:   string
  buyerEmail:  string
  buyerPhone:  string
  packageName: string
}

export async function createSnapToken(params: SnapTokenParams): Promise<string> {
  const payload = {
    transaction_details: {
      order_id:     params.orderId,
      gross_amount: params.amount,
    },
    customer_details: {
      first_name: params.buyerName,
      email:      params.buyerEmail,
      phone:      params.buyerPhone,
    },
    item_details: [
      {
        id:       params.orderId,
        name:     params.packageName,
        price:    params.amount,
        quantity: 1,
      },
    ],
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/smm/order/success`,
    },
  }

  const auth = Buffer.from(`${SERVER_KEY}:`).toString("base64")
  const res  = await fetch(`${BASE_URL}/transactions`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body:    JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error_messages?.[0] ?? "Gagal membuat token pembayaran")
  }

  const data = await res.json()
  return data.token as string
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  receivedSignature: string
): boolean {
  const crypto = require("crypto")
  const raw    = `${orderId}${statusCode}${grossAmount}${SERVER_KEY}`
  const hash   = crypto.createHash("sha512").update(raw).digest("hex")
  return hash === receivedSignature
}