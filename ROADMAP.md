# 🗺️ ROADMAP.md — Product Roadmap

**Proyek:** Vibe Product ID  
**Terakhir diperbarui:** 2025

---

## 🏁 Visi Jangka Panjang

Menjadi platform digital multi-layanan terpercaya di Indonesia yang membantu UMKM dan kreator digital tumbuh melalui layanan SMM, konten digital, dan ekosistem affiliate.

---

## 📅 Phase Overview

```
Phase 1: Foundation          [Bulan 1]      Setup & Landing Page
Phase 2: Core Modules        [Bulan 1–2]    SMM + Wedding
Phase 3: Content Engine      [Bulan 2–3]    Affiliate + Blog
Phase 4: Community Content   [Bulan 3–4]    Ideathon + Docs
Phase 5: Optimization        [Bulan 4–5]    SEO, Performa, Monetisasi
Phase 6: Scale               [Bulan 6+]     Fitur lanjutan
```

---

## 🚀 Phase 1 — Foundation (Minggu 1–2)

> Tujuan: Project siap jalan, struktur kode solid, halaman landing page live

### Infrastructure
- [ ] Setup project Next.js 14 + TypeScript + Tailwind + shadcn/ui
- [ ] Konfigurasi Drizzle ORM + koneksi Neon PostgreSQL
- [ ] Setup Better Auth (email/password)
- [ ] Setup Vercel deployment + domain vibeproduct.biz.id
- [ ] Konfigurasi environment variables
- [ ] Setup ESLint + Prettier

### Landing Page
- [ ] Desain hero section dengan tagline brand
- [ ] Section layanan (SMM, Wedding, Blog, Ideathon)
- [ ] Section keunggulan / why us
- [ ] Section testimoni (placeholder awal)
- [ ] Section FAQ
- [ ] Footer dengan link sosial media
- [ ] Halaman login admin `/auth/login`
- [ ] Middleware proteksi route `/dashboard`

---

## 🛒 Phase 2 — Core Modules (Minggu 2–4)

> Tujuan: Dua modul bisnis utama live dan bisa menerima order/inquiry

### SMM Panel
- [ ] Schema DB: `smm_categories`, `smm_packages`, `smm_orders`
- [ ] Halaman publik `/smm` — katalog paket
- [ ] Filter paket per platform
- [ ] Form order + validasi
- [ ] Integrasi Midtrans Snap (payment)
- [ ] Webhook `/api/payment/notification`
- [ ] Halaman konfirmasi order
- [ ] Dashboard: CRUD kategori & paket
- [ ] Dashboard: tabel order + update status manual
- [ ] Notifikasi email (Resend) ke admin saat order baru

### Wedding Invitation
- [ ] Schema DB: `wedding_themes`
- [ ] Halaman publik `/wedding` — galeri tema
- [ ] Filter per kategori tema
- [ ] Modal preview dengan iframe embed
- [ ] Tombol WhatsApp order otomatis
- [ ] Dashboard: CRUD tema undangan
- [ ] Dashboard: atur urutan tampilan

---

## 🔗 Phase 3 — Content Engine (Minggu 4–6)

> Tujuan: Mesin konten dan affiliate aktif, mulai hasilkan traffic organik

### Affiliate Management
- [ ] Schema DB: `affiliate_links`
- [ ] Dashboard: CRUD link affiliate
- [ ] Filter per platform (Shopee, Tokopedia, TikTok Shop)
- [ ] Komponen `<AffiliateCard />` dan `<AffiliateGrid />`
- [ ] Tracking click count per link

### Blog
- [ ] Schema DB: `blog_posts`, `blog_categories`, `ai_settings`
- [ ] Dashboard: rich text editor (Tiptap)
- [ ] Fitur AI generate konten (Vercel AI SDK)
- [ ] Dashboard: pengaturan AI provider + API key
- [ ] Insert affiliate link di editor
- [ ] Komponen `<AdSlot />` (Adsense)
- [ ] SEO fields per artikel
- [ ] Halaman publik `/blog` — daftar artikel
- [ ] Halaman publik `/blog/[slug]` — detail artikel
- [ ] Sitemap otomatis untuk blog

---

## 💡 Phase 4 — Community Content (Minggu 6–8)

> Tujuan: Platform konten lengkap, semua modul live

### Ideathon
- [ ] Schema DB: `ideathon_posts`, `ideathon_categories`
- [ ] Dashboard: editor post dengan embed video support
- [ ] Support embed: YouTube, TikTok, Facebook, Instagram Reels
- [ ] Insert affiliate link di editor
- [ ] Komponen `<AdSlot />` (Adsense)
- [ ] Halaman publik `/ideathon` — feed ide
- [ ] Halaman publik `/ideathon/[slug]`
- [ ] Filter per kategori

### Documentation
- [ ] Schema DB: `docs_categories`, `docs_pages`
- [ ] Dashboard: CRUD kategori & halaman docs
- [ ] Sidebar navigasi hierarki
- [ ] Editor konten dengan insert affiliate
- [ ] Search dokumentasi
- [ ] Halaman publik `/docs`

---

## ⚡ Phase 5 — Optimization (Bulan 3–4)

> Tujuan: Platform siap scale, performa optimal, monetisasi berjalan

### SEO & Performa
- [ ] Optimasi Core Web Vitals (LCP < 2.5s)
- [ ] Open Graph image otomatis per halaman
- [ ] Sitemap XML untuk semua halaman publik
- [ ] robots.txt
- [ ] Google Search Console integration
- [ ] Lazy loading gambar & komponen

### Monetisasi
- [ ] Apply Google Adsense (domain harus punya konten cukup)
- [ ] Verifikasi Adsense dan pasang di Blog & Ideathon
- [ ] Review performa affiliate link per platform
- [ ] A/B test posisi iklan

### UX Improvement
- [ ] Dark/light mode toggle
- [ ] Loading skeleton di semua halaman data
- [ ] Toast notification yang konsisten
- [ ] Error boundary di semua halaman
- [ ] Halaman 404 & 500 custom

---

## 🚀 Phase 6 — Scale (Bulan 5+)

> Fitur lanjutan untuk pertumbuhan bisnis

### SMM Enhancement
- [ ] Integrasi API SMM panel pihak ketiga (otomasi order)
- [ ] Dashboard statistik pendapatan
- [ ] Sistem diskon / voucher
- [ ] Halaman riwayat order untuk buyer (dengan tracking via email)

### Content Enhancement
- [ ] Newsletter subscriber
- [ ] RSS feed untuk blog
- [ ] Related posts otomatis di Blog & Ideathon
- [ ] Social sharing buttons

### Analytics
- [ ] Integrasi Google Analytics 4
- [ ] Dashboard analytics sederhana (pageview, order, revenue)
- [ ] Laporan pendapatan bulanan otomatis via email

---

## 📊 Success Metrics per Phase

| Phase | Metrik Target |
|-------|--------------|
| Phase 1 | Website live, admin bisa login |
| Phase 2 | Pertama kali menerima order nyata |
| Phase 3 | 5+ artikel blog live, 20+ affiliate link |
| Phase 4 | Semua modul aktif dan bisa diakses publik |
| Phase 5 | Adsense approved, traffic organik mulai masuk |
| Phase 6 | Pendapatan pasif > Rp 1.000.000/bulan |
