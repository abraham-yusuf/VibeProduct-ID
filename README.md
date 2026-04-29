# 🚀 Vibe Product ID

> Platform digital multi-layanan untuk SMM Panel, Wedding Invitation, Blog, Ideathon, dan Affiliate Management.

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## 📌 Tentang Proyek

**Vibe Product ID** adalah platform bisnis digital all-in-one yang dibangun di atas Next.js. Platform ini menggabungkan beberapa layanan dalam satu dashboard terpusat:

- 🛒 **SMM Panel** — Jual layanan sosial media (followers, likes, views) sebagai reseller
- 💍 **Wedding Invitation** — Jasa pembuatan website undangan pernikahan digital
- 🔗 **Affiliate Management** — Manajemen link produk affiliate dari Shopee, Tokopedia, TikTok Shop
- ✍️ **Blog** — Platform blog dengan AI auto-generate konten & Google Adsense
- 💡 **Ideathon** — Kurasi ide bisnis dengan embed video & integrasi affiliate
- 📚 **Documentation** — Dokumentasi penggunaan platform

---

## 🌐 Domain

**Production:** [https://vibeproduct.biz.id](https://vibeproduct.biz.id)

---

## ✨ Fitur Utama

- ✅ Multi-modul dalam satu platform
- ✅ Dashboard admin yang fully customizable
- ✅ Integrasi AI multi-provider (OpenAI, Claude, OpenRouter)
- ✅ Payment gateway lokal (Midtrans / Xendit)
- ✅ Google Adsense support di Blog & Ideathon
- ✅ Embed video YouTube, TikTok, Facebook, Instagram
- ✅ Affiliate link management lintas modul
- ✅ Autentikasi aman dengan Better Auth
- ✅ Desain responsif dengan Tailwind CSS + shadcn/ui

---

## 🚀 Quick Start

### Prasyarat

- Node.js >= 18.x
- pnpm >= 8.x
- PostgreSQL (Neon serverless direkomendasikan)

### Instalasi

```bash
# Clone repository
git clone https://github.com/abraham-yusuf/VibeProduct-ID.git
cd VibeProduct-ID

# Install dependencies
pnpm install

# Salin environment variables
cp .env.example .env.local

# Push schema database
pnpm db:push

# Jalankan development server
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 📁 Struktur Proyek

```
vibeproduct-id/
├── app/                        # Next.js App Router
│   ├── (public)/               # Halaman publik
│   │   ├── page.tsx            # Landing page
│   │   ├── smm/                # SMM Panel publik
│   │   ├── wedding/            # Wedding Invitation publik
│   │   ├── blog/               # Blog publik
│   │   └── ideathon/           # Ideathon publik
│   ├── dashboard/              # Admin dashboard (protected)
│   │   ├── smm/
│   │   ├── wedding/
│   │   ├── affiliate/
│   │   ├── blog/
│   │   ├── docs/
│   │   └── ideathon/
│   └── api/                    # API Routes
├── components/                 # Shared components
│   ├── ui/                     # shadcn/ui components
│   ├── dashboard/              # Dashboard components
│   └── public/                 # Public page components
├── lib/                        # Utilities & config
│   ├── auth.ts                 # Better Auth config
│   ├── db/                     # Drizzle ORM setup
│   └── ai/                     # AI provider config
├── drizzle/                    # Database migrations
├── public/                     # Static assets
└── docs/                       # Internal documentation
```

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=

# Payment
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=

# Google
GOOGLE_ADSENSE_ID=
```

---

## 📜 Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint
pnpm db:push      # Push Drizzle schema
pnpm db:studio    # Drizzle Studio (DB GUI)
pnpm db:migrate   # Run migrations
```

---

## 🤝 Kontribusi

Proyek ini bersifat privat. Hanya kontributor yang diundang yang dapat berkontribusi.

---

## 📄 Lisensi

MIT © 2025 Vibe Product ID
