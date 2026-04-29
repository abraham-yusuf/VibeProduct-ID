# 🛠️ TECHSTACK.md — Technology Stack

**Proyek:** Vibe Product ID  
**Terakhir diperbarui:** 2025

---

## 🧱 Core Framework

| Teknologi | Versi | Alasan Pemilihan |
|-----------|-------|-----------------|
| **Next.js** | 14+ (App Router) | Full-stack framework terbaik untuk React, SSR/SSG built-in, optimal untuk SEO |
| **TypeScript** | 5.x | Type safety, mengurangi bug, DX lebih baik |
| **React** | 18+ | UI library, sudah bundled dengan Next.js |

---

## 🎨 Styling & UI

| Teknologi | Versi | Alasan Pemilihan |
|-----------|-------|-----------------|
| **Tailwind CSS** | 3.x | Utility-first, cepat, tidak ada CSS konflik |
| **shadcn/ui** | Latest | Komponen siap pakai, fully customizable, tidak sebagai dependency |
| **lucide-react** | Latest | Icon library yang konsisten dengan shadcn/ui |
| **framer-motion** | Latest | Animasi halus dan profesional |
| **next-themes** | Latest | Dark/light mode management |
| **Tiptap** | 2.x | Rich text editor terbaik untuk React, extensible |

---

## 🗄️ Database & ORM

| Teknologi | Versi | Alasan Pemilihan |
|-----------|-------|-----------------|
| **PostgreSQL** | 15+ | Database relasional yang robust |
| **Neon** | - | Serverless PostgreSQL, gratis tier, auto-scale, cocok untuk Vercel |
| **Drizzle ORM** | Latest | Type-safe, ringan, performan, cocok untuk edge runtime |

### Kenapa Drizzle bukan Prisma?
- Drizzle lebih ringan dan tidak butuh binary engine
- Full type inference langsung dari schema
- Kompatibel dengan Vercel Edge Functions
- Query lebih dekat ke SQL (lebih mudah di-debug)

---

## 🔐 Autentikasi

| Teknologi | Versi | Alasan Pemilihan |
|-----------|-------|-----------------|
| **Better Auth** | Latest | Open source, kontrol penuh, self-hosted, tidak ada biaya per user |

### Kenapa Better Auth?
- Tidak ada vendor lock-in
- Data user tersimpan di database sendiri
- Gratis selamanya tanpa batas user
- Dukungan Drizzle adapter built-in

---

## 🤖 AI Integration

| Teknologi | Versi | Alasan Pemilihan |
|-----------|-------|-----------------|
| **Vercel AI SDK** | Latest | Abstraksi unified untuk semua AI provider |
| **OpenAI** | - | Provider utama (GPT-4o) |
| **Anthropic** | - | Provider alternatif (Claude) |
| **OpenRouter** | - | Aggregator model AI, akses ke 100+ model |

### Arsitektur AI Multi-Provider
```
Setting di Dashboard
        ↓
lib/ai/providers.ts (factory pattern)
        ↓
Vercel AI SDK (streamText / generateText)
        ↓
Provider terpilih (OpenAI / Anthropic / OpenRouter)
```

---

## 💰 Payment Gateway

| Teknologi | Alasan Pemilihan |
|-----------|-----------------|
| **Midtrans** | Payment gateway terpercaya Indonesia, support QRIS, VA, e-wallet, kartu kredit |

### Flow Pembayaran
```
User submit order
      ↓
Server buat transaksi Midtrans (Snap Token)
      ↓
Frontend tampilkan Midtrans Snap popup
      ↓
User bayar
      ↓
Midtrans kirim webhook ke /api/payment/notification
      ↓
Server update status order → Paid
      ↓
Admin dapat notifikasi email
```

---

## 📧 Email

| Teknologi | Alasan Pemilihan |
|-----------|-----------------|
| **Resend** | Email API modern, gratis 3000/bulan, integrasi mudah |
| **React Email** | Template email dengan React components |

---

## ☁️ Deployment & Infrastructure

| Teknologi | Alasan Pemilihan |
|-----------|-----------------|
| **Vercel** | Platform terbaik untuk Next.js, CI/CD otomatis, edge network global |
| **Neon** | Serverless PostgreSQL, auto-suspend saat tidak aktif (hemat biaya) |
| **Vercel Blob** | Upload & storage untuk gambar (thumbnail, OG image) |

---

## 📦 Package Manager & Tools

| Teknologi | Alasan |
|-----------|--------|
| **pnpm** | Lebih cepat dari npm/yarn, disk efficient |
| **ESLint** | Linting konsisten |
| **Prettier** | Formatting otomatis |
| **Zod** | Runtime validation + TypeScript inference |
| **Drizzle Kit** | CLI untuk migrasi database |

---

## 📋 Dependency Lengkap

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "next-themes": "^0.3.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0",
    
    "@tiptap/react": "^2.4.0",
    "@tiptap/starter-kit": "^2.4.0",
    "@tiptap/extension-image": "^2.4.0",
    "@tiptap/extension-link": "^2.4.0",
    
    "drizzle-orm": "^0.31.0",
    "@neondatabase/serverless": "^0.9.0",
    
    "better-auth": "^1.0.0",
    
    "ai": "^3.2.0",
    "@ai-sdk/openai": "^0.0.30",
    "@ai-sdk/anthropic": "^0.0.30",
    "@openrouter/ai-sdk-provider": "latest",
    
    "zod": "^3.23.0",
    "resend": "^3.2.0",
    "@react-email/components": "^0.0.20"
  },
  "devDependencies": {
    "drizzle-kit": "^0.22.0",
    "eslint": "^8.57.0",
    "prettier": "^3.3.0",
    "prettier-plugin-tailwindcss": "^0.6.0"
  }
}
```

---

## 🗺️ Arsitektur Sistem

```
┌─────────────────────────────────────────────┐
│                   VERCEL                     │
│  ┌─────────────┐    ┌─────────────────────┐ │
│  │  Next.js    │    │   Edge Functions    │ │
│  │  App Router │    │   (API Routes)      │ │
│  └──────┬──────┘    └──────────┬──────────┘ │
└─────────┼────────────────────-─┼────────────┘
          │                      │
          ▼                      ▼
┌─────────────────┐   ┌─────────────────────┐
│   Neon DB       │   │   External APIs     │
│   PostgreSQL    │   │   - Midtrans        │
│   (Drizzle ORM) │   │   - OpenAI          │
└─────────────────┘   │   - Anthropic       │
                      │   - Resend Email    │
┌─────────────────┐   └─────────────────────┘
│  Vercel Blob    │
│  (File Storage) │
└─────────────────┘
```
