# ✅ TODO.md — Task List per Phase

**Proyek:** Vibe Product ID  
**Format:** `- [ ]` belum dikerjakan | `- [x]` sudah selesai  
**Terakhir diperbarui:** 2025

---

## 🏗️ PHASE 1 — Foundation & Landing Page

### 1.1 Project Setup
- [ ] Init project Next.js 14 dengan TypeScript: `pnpm create next-app@latest vibeproduct-id --typescript --tailwind --app`
- [ ] Install dan konfigurasi shadcn/ui: `pnpm dlx shadcn@latest init`
- [ ] Install dependencies utama: `framer-motion`, `lucide-react`, `next-themes`, `clsx`, `tailwind-merge`, `zod`
- [ ] Install Drizzle ORM: `pnpm add drizzle-orm @neondatabase/serverless` + `pnpm add -D drizzle-kit`
- [ ] Install Better Auth: `pnpm add better-auth`
- [ ] Konfigurasi `drizzle.config.ts`
- [ ] Buat `lib/db/index.ts` — koneksi Neon
- [ ] Buat `lib/utils.ts` — fungsi `cn()` dan `formatRupiah()`
- [ ] Setup `.env.local` dan `.env.example`
- [ ] Konfigurasi ESLint + Prettier + `prettier-plugin-tailwindcss`
- [ ] Push ke GitHub repository

### 1.2 Autentikasi
- [ ] Buat schema Better Auth di `lib/db/schema/auth.ts`
- [ ] Konfigurasi `lib/auth.ts` dengan Drizzle adapter
- [ ] Buat `app/api/auth/[...all]/route.ts`
- [ ] Buat halaman login: `app/(auth)/login/page.tsx`
- [ ] Buat `middleware.ts` untuk proteksi route `/dashboard`
- [ ] Test login/logout berfungsi

### 1.3 Layout & Navigation
- [ ] Buat root layout `app/layout.tsx` dengan ThemeProvider
- [ ] Buat layout publik `app/(public)/layout.tsx` + Navbar publik
- [ ] Buat layout dashboard `app/dashboard/layout.tsx` + Sidebar dashboard
- [ ] Buat komponen `<Navbar />` untuk halaman publik
- [ ] Buat komponen `<Sidebar />` untuk dashboard
- [ ] Buat komponen `<Footer />` untuk halaman publik

### 1.4 Landing Page
- [ ] Buat `app/(public)/page.tsx` — halaman utama
- [ ] Buat komponen `<HeroSection />` dengan animasi framer-motion
- [ ] Buat komponen `<ServicesSection />` — showcase 4 layanan
- [ ] Buat komponen `<WhyUsSection />` — keunggulan platform
- [ ] Buat komponen `<TestimoniSection />` — placeholder testimoni
- [ ] Buat komponen `<FAQSection />` — accordion FAQ
- [ ] Buat komponen `<CTASection />` — call to action
- [ ] Buat halaman 404 custom `app/not-found.tsx`
- [ ] Test responsivitas di mobile dan desktop

### 1.5 Deployment
- [ ] Connect repository ke Vercel
- [ ] Set environment variables di Vercel dashboard
- [ ] Connect domain `vibeproduct.biz.id` ke Vercel
- [ ] Verifikasi HTTPS dan domain aktif
- [ ] Test production deployment

---

## 🛒 PHASE 2 — SMM Panel & Wedding Invitation

### 2.1 SMM Panel — Database
- [ ] Buat schema `lib/db/schema/smm.ts`: `smm_categories`, `smm_packages`, `smm_orders`
- [ ] Export schema di `lib/db/index.ts`
- [ ] Run `pnpm db:push`
- [ ] Buat Zod schema di `lib/validations/smm.ts`

### 2.2 SMM Panel — Halaman Publik
- [ ] Buat `app/(public)/smm/page.tsx` — halaman katalog paket
- [ ] Buat komponen `<SmmCategoryTabs />` — filter per platform
- [ ] Buat komponen `<SmmPackageCard />` — kartu paket
- [ ] Buat komponen `<SmmOrderForm />` — form order
- [ ] Buat `app/(public)/smm/order/[packageId]/page.tsx`
- [ ] Buat `app/(public)/smm/order/success/page.tsx` — konfirmasi sukses
- [ ] Buat `app/(public)/smm/order/pending/page.tsx` — menunggu pembayaran

### 2.3 SMM Panel — Payment
- [ ] Install Midtrans: `pnpm add midtrans-client`
- [ ] Buat `lib/midtrans.ts` — konfigurasi Midtrans
- [ ] Buat `app/api/smm/create-order/route.ts` — buat transaksi Midtrans
- [ ] Buat `app/api/payment/notification/route.ts` — webhook Midtrans
- [ ] Validasi signature key di webhook
- [ ] Update status order otomatis dari webhook
- [ ] Test alur pembayaran (gunakan sandbox Midtrans)

### 2.4 SMM Panel — Email Notifikasi
- [ ] Install Resend: `pnpm add resend @react-email/components`
- [ ] Buat `lib/email/index.ts` — konfigurasi Resend
- [ ] Buat template email `emails/new-order.tsx`
- [ ] Kirim email ke admin saat order baru dengan status PAID

### 2.5 SMM Panel — Dashboard Admin
- [ ] Buat `app/dashboard/smm/page.tsx` — ringkasan SMM
- [ ] Buat `app/dashboard/smm/packages/page.tsx` — kelola paket
- [ ] Buat komponen `<PackageTable />` dengan CRUD
- [ ] Buat `app/dashboard/smm/categories/page.tsx` — kelola kategori
- [ ] Buat `app/dashboard/smm/orders/page.tsx` — tabel semua order
- [ ] Buat komponen `<OrderStatusBadge />` dengan warna per status
- [ ] Buat fitur update status order manual (dropdown per baris)
- [ ] Buat fitur export order ke CSV

### 2.6 Wedding Invitation — Database
- [ ] Buat schema `lib/db/schema/wedding.ts`: `wedding_themes`
- [ ] Export schema di `lib/db/index.ts`
- [ ] Run `pnpm db:push`
- [ ] Buat Zod schema di `lib/validations/wedding.ts`

### 2.7 Wedding Invitation — Halaman Publik
- [ ] Buat `app/(public)/wedding/page.tsx` — galeri tema
- [ ] Buat komponen `<ThemeGrid />` — grid semua tema
- [ ] Buat komponen `<ThemeCard />` — kartu per tema
- [ ] Buat komponen filter kategori tema
- [ ] Buat komponen `<ThemePreviewModal />` — iframe preview fullscreen
- [ ] Buat tombol "Pesan via WhatsApp" dengan pesan otomatis
- [ ] Sanitasi `demo_url` sebelum dirender sebagai iframe

### 2.8 Wedding Invitation — Dashboard Admin
- [ ] Buat `app/dashboard/wedding/page.tsx` — daftar tema
- [ ] Buat form tambah/edit tema (nama, kategori, harga, URL demo, thumbnail)
- [ ] Buat fitur drag-and-drop urutan tema (atau sort manual)
- [ ] Buat toggle aktif/nonaktif tema
- [ ] Upload thumbnail ke Vercel Blob

---

## 🔗 PHASE 3 — Affiliate & Blog

### 3.1 Affiliate Management — Database
- [ ] Buat schema `lib/db/schema/affiliate.ts`: `affiliate_links`
- [ ] Export schema di `lib/db/index.ts`
- [ ] Run `pnpm db:push`
- [ ] Buat Zod schema di `lib/validations/affiliate.ts`

### 3.2 Affiliate Management — Dashboard
- [ ] Buat `app/dashboard/affiliate/page.tsx` — daftar link affiliate
- [ ] Buat form tambah/edit link affiliate
- [ ] Buat filter per platform
- [ ] Buat komponen `<AffiliateCard />` — reusable card
- [ ] Buat komponen `<AffiliateGrid />` — grid reusable
- [ ] Buat komponen `<AffiliatePickerModal />` — modal pilih affiliate untuk disisipkan

### 3.3 Blog — Database & AI Settings
- [ ] Buat schema `lib/db/schema/blog.ts`: `blog_posts`, `blog_categories`, `ai_settings`
- [ ] Export schema di `lib/db/index.ts`
- [ ] Run `pnpm db:push`
- [ ] Buat Zod schema di `lib/validations/blog.ts`

### 3.4 Blog — AI Integration
- [ ] Install Vercel AI SDK: `pnpm add ai @ai-sdk/openai @ai-sdk/anthropic`
- [ ] Install OpenRouter provider: `pnpm add @openrouter/ai-sdk-provider`
- [ ] Buat `lib/ai/providers.ts` — factory function multi-provider
- [ ] Buat `app/api/blog/generate/route.ts` — endpoint AI generate konten
- [ ] Buat UI modal AI generate: form topik, panjang, nada, bahasa, pilih provider

### 3.5 Blog — Dashboard
- [ ] Install Tiptap: `pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link`
- [ ] Buat komponen `<TiptapEditor />` — rich text editor
- [ ] Extend Tiptap dengan ekstensi insert affiliate link
- [ ] Buat `app/dashboard/blog/page.tsx` — daftar postingan
- [ ] Buat `app/dashboard/blog/new/page.tsx` — buat postingan baru
- [ ] Buat `app/dashboard/blog/[id]/edit/page.tsx` — edit postingan
- [ ] Buat `app/dashboard/blog/categories/page.tsx` — kelola kategori
- [ ] Buat `app/dashboard/settings/ai/page.tsx` — pengaturan AI provider & API key
- [ ] Buat komponen `<AdSlot position="..." />` — placeholder Adsense

### 3.6 Blog — Halaman Publik
- [ ] Buat `app/(public)/blog/page.tsx` — daftar artikel
- [ ] Buat `app/(public)/blog/[slug]/page.tsx` — detail artikel
- [ ] Sisipkan `<AdSlot />` di header, dalam konten, dan footer artikel
- [ ] Render affiliate card yang disisipkan di konten
- [ ] Buat SEO metadata dinamis per artikel
- [ ] Buat `app/sitemap.ts` — sitemap otomatis
- [ ] Buat `app/robots.ts`

---

## 💡 PHASE 4 — Ideathon & Documentation

### 4.1 Ideathon — Database
- [ ] Buat schema `lib/db/schema/ideathon.ts`: `ideathon_posts`, `ideathon_categories`
- [ ] Export schema di `lib/db/index.ts`
- [ ] Run `pnpm db:push`
- [ ] Buat Zod schema di `lib/validations/ideathon.ts`

### 4.2 Ideathon — Embed Video
- [ ] Buat `lib/embed.ts` — parser URL video ke embed URL
- [ ] Support: YouTube, TikTok, Facebook Reels, Instagram Reels
- [ ] Buat komponen `<VideoEmbed url="..." type="..." />`
- [ ] Sanitasi URL embed sebelum dirender

### 4.3 Ideathon — Dashboard
- [ ] Buat `app/dashboard/ideathon/page.tsx` — daftar post
- [ ] Buat `app/dashboard/ideathon/new/page.tsx` — buat post baru
- [ ] Buat `app/dashboard/ideathon/[id]/edit/page.tsx` — edit post
- [ ] Buat `app/dashboard/ideathon/categories/page.tsx` — kelola kategori
- [ ] Tambahkan `<AffiliatePickerModal />` di editor Ideathon
- [ ] Tambahkan `<AdSlot />` di editor

### 4.4 Ideathon — Halaman Publik
- [ ] Buat `app/(public)/ideathon/page.tsx` — feed ide
- [ ] Buat `app/(public)/ideathon/[slug]/page.tsx` — detail ide
- [ ] Render embed video dengan `<VideoEmbed />`
- [ ] Sisipkan `<AdSlot />` dan affiliate cards
- [ ] Filter per kategori

### 4.5 Documentation — Database
- [ ] Buat schema `lib/db/schema/docs.ts`: `docs_categories`, `docs_pages`
- [ ] Export schema di `lib/db/index.ts`
- [ ] Run `pnpm db:push`

### 4.6 Documentation — Dashboard
- [ ] Buat `app/dashboard/docs/page.tsx` — daftar halaman docs
- [ ] Buat `app/dashboard/docs/new/page.tsx` — buat halaman baru
- [ ] Buat `app/dashboard/docs/categories/page.tsx` — kelola kategori
- [ ] Tambahkan `<AffiliatePickerModal />` di editor

### 4.7 Documentation — Halaman Publik
- [ ] Buat `app/(public)/docs/layout.tsx` — layout dengan sidebar navigasi
- [ ] Buat komponen `<DocsSidebar />` — navigasi hierarki
- [ ] Buat `app/(public)/docs/[...slug]/page.tsx` — render halaman docs
- [ ] Buat fitur search docs

---

## ⚡ PHASE 5 — Optimization & Monetisasi

### 5.1 SEO & Performa
- [ ] Audit Core Web Vitals dengan Vercel Speed Insights
- [ ] Optimasi semua gambar dengan `next/image`
- [ ] Tambahkan loading skeleton di halaman-halaman utama
- [ ] Buat Open Graph image dinamis dengan `next/og`
- [ ] Verifikasi sitemap di Google Search Console
- [ ] Setup Google Search Console

### 5.2 Google Adsense
- [ ] Apply Google Adsense (tunggu approval)
- [ ] Pasang script Adsense di layout publik
- [ ] Konfigurasi `<AdSlot />` dengan Ad Unit ID yang sebenarnya
- [ ] Test tampilan iklan di Blog dan Ideathon

### 5.3 UX Polish
- [ ] Implementasi dark/light mode toggle di Navbar
- [ ] Tambahkan error boundary global
- [ ] Buat komponen `<LoadingSkeleton />` yang konsisten
- [ ] Buat komponen `<EmptyState />` untuk tabel/daftar kosong
- [ ] Review semua toast notification (success, error, loading)
- [ ] Test semua halaman di mobile (375px, 390px)
- [ ] Test semua halaman di desktop (1280px, 1440px)

### 5.4 Security
- [ ] Audit semua API route — pastikan yang butuh auth sudah diproteksi
- [ ] Validasi signature webhook Midtrans
- [ ] Sanitasi semua input user dengan Zod
- [ ] Review environment variables — tidak ada yang terekspos ke client
- [ ] Aktifkan CSP header di `next.config.ts`

---

## 🚀 PHASE 6 — Scale & Enhancement

- [ ] Integrasi API SMM panel pihak ketiga untuk otomasi order
- [ ] Dashboard statistik pendapatan (chart per bulan)
- [ ] Sistem voucher/diskon untuk SMM Panel
- [ ] Halaman riwayat order untuk buyer (akses via email)
- [ ] Fitur newsletter subscriber
- [ ] RSS feed untuk blog
- [ ] Related posts otomatis
- [ ] Social sharing buttons (Twitter/X, WhatsApp, Telegram)
- [ ] Integrasi Google Analytics 4
- [ ] Laporan pendapatan otomatis via email (bulanan)
