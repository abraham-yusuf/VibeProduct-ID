# 🤖 AGENT.md — Panduan untuk AI Coding Agent

> File ini berisi instruksi khusus untuk AI agent (Claude, GitHub Copilot, dll.) yang membantu pengembangan proyek **Vibe Product ID**.

---

## 🎯 Identitas Proyek

- **Nama:** Vibe Product ID
- **Domain:** vibeproduct.biz.id
- **Tipe:** Full-stack web application (Next.js 14+ App Router)
- **Bahasa utama:** TypeScript
- **Owner:** Admin tunggal (single-tenant dashboard)

---

## 📋 Instruksi Umum untuk Agent

### Prinsip Utama
1. **Selalu gunakan TypeScript** — tidak ada file `.js` di dalam `app/` atau `components/`
2. **Gunakan App Router** — jangan gunakan Pages Router (`pages/` directory)
3. **Server Components by default** — gunakan `"use client"` hanya jika diperlukan (event handler, hooks)
4. **Drizzle ORM** untuk semua operasi database — jangan gunakan Prisma
5. **Better Auth** untuk semua autentikasi — jangan gunakan NextAuth atau Clerk
6. **shadcn/ui + Tailwind CSS** untuk semua UI — jangan install UI library lain kecuali diminta
7. **Vercel AI SDK** untuk semua integrasi AI

### Konvensi Penamaan
```
Komponen     : PascalCase    → SmmPackageCard.tsx
Hooks        : camelCase     → useSmmOrders.ts
Utilities    : camelCase     → formatCurrency.ts
API routes   : kebab-case    → /api/smm-orders
DB tables    : snake_case    → smm_orders, wedding_themes
```

### Struktur File yang Harus Diikuti
```
app/
  (public)/           # Group route publik (tanpa layout dashboard)
  (auth)/             # Group route autentikasi
  dashboard/          # Protected routes
  api/                # API endpoints

components/
  ui/                 # Hanya shadcn/ui components
  shared/             # Komponen reusable lintas modul
  [module]/           # Komponen spesifik modul

lib/
  db/
    schema/           # Satu file per modul (smm.ts, wedding.ts, dst.)
    index.ts          # Export semua schema
  auth.ts
  ai/
    providers.ts      # Konfigurasi semua AI provider
```

---

## 🗄️ Panduan Database (Drizzle + PostgreSQL)

### Cara Mendefinisikan Schema
```typescript
// lib/db/schema/smm.ts
import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core"

export const smmPackages = pgTable("smm_packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // instagram, tiktok, youtube
  type: text("type").notNull(),         // followers, likes, views
  price: integer("price").notNull(),    // dalam rupiah
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
```

### Cara Query
```typescript
import { db } from "@/lib/db"
import { smmPackages } from "@/lib/db/schema/smm"
import { eq } from "drizzle-orm"

// SELECT
const packages = await db.select().from(smmPackages).where(eq(smmPackages.isActive, true))

// INSERT
await db.insert(smmPackages).values({ name: "...", ... })

// UPDATE
await db.update(smmPackages).set({ isActive: false }).where(eq(smmPackages.id, id))
```

---

## 🔐 Panduan Autentikasi (Better Auth)

```typescript
// lib/auth.ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
})
```

- Semua route dalam `/dashboard/**` harus diproteksi via middleware
- Gunakan `auth.api.getSession()` di Server Components
- Gunakan `authClient.useSession()` di Client Components

---

## 🤖 Panduan Integrasi AI (Vercel AI SDK)

```typescript
// lib/ai/providers.ts
import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"

export function getAIProvider(provider: string, apiKey: string) {
  switch (provider) {
    case "openai":     return createOpenAI({ apiKey })("gpt-4o")
    case "anthropic":  return createAnthropic({ apiKey })("claude-sonnet-4-20250514")
    case "openrouter": return createOpenRouter({ apiKey })("openai/gpt-4o")
    default: throw new Error("Unknown provider")
  }
}
```

---

## 💰 Panduan Payment (Midtrans)

- Gunakan **Midtrans Snap** untuk UI pembayaran
- Simpan `order_id` dan `transaction_status` di tabel `smm_orders`
- Gunakan webhook `/api/payment/notification` untuk update status otomatis
- Selalu validasi signature key di webhook

---

## 📝 Panduan Membuat API Route

```typescript
// app/api/smm/packages/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const data = await db.select().from(smmPackages)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 })
  }
}

// Route yang butuh auth:
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // ...
}
```

---

## ⛔ Hal yang TIDAK Boleh Dilakukan Agent

- ❌ Jangan gunakan `pages/` directory
- ❌ Jangan install Prisma
- ❌ Jangan gunakan NextAuth atau Clerk
- ❌ Jangan hardcode API key di source code
- ❌ Jangan gunakan `any` type di TypeScript
- ❌ Jangan buat komponen client tanpa alasan jelas
- ❌ Jangan gunakan `fetch` langsung ke DB — selalu lewat Drizzle
- ❌ Jangan skip error handling di API routes

---

## ✅ Checklist Sebelum Commit

- [ ] Tidak ada TypeScript error (`pnpm tsc --noEmit`)
- [ ] Tidak ada ESLint error (`pnpm lint`)
- [ ] Semua env variable ada di `.env.example`
- [ ] Schema baru sudah di-push (`pnpm db:push`)
- [ ] Komponen baru sudah responsif (mobile-first)
