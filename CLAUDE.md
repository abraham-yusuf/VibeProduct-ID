# 🧠 CLAUDE.md — Instruksi Khusus untuk Claude AI Agent

> File ini dibaca otomatis oleh Claude saat bekerja di proyek ini. Berisi konteks proyek, preferensi coding, dan instruksi spesifik.

---

## 🏠 Konteks Proyek

Kamu sedang membantu membangun **Vibe Product ID** — platform bisnis digital multi-modul untuk pasar Indonesia. Owner adalah seorang solo founder yang mengelola semua layanan sendiri. Dashboard hanya untuk satu admin (single-tenant).

**Stack yang digunakan:**
- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS + shadcn/ui + lucide-react + framer-motion
- Drizzle ORM + PostgreSQL (Neon)
- Better Auth
- Vercel AI SDK (multi-provider: OpenAI, Anthropic, OpenRouter)
- Midtrans (payment gateway)

---

## 🎨 Preferensi UI/UX

- Desain **dark mode by default** dengan aksen warna **violet/purple** sebagai brand color
- Gunakan komponen shadcn/ui yang sudah ada sebelum membuat custom component
- Animasi subtle dengan framer-motion (jangan berlebihan)
- Semua halaman harus **mobile-first responsive**
- Landing page harus terkesan **profesional dan modern** — bukan template biasa
- Gunakan `cn()` dari `lib/utils` untuk conditional className

---

## 🗣️ Gaya Komunikasi Claude

Saat membantu proyek ini:
- Gunakan **Bahasa Indonesia** untuk penjelasan
- Gunakan **komentar kode dalam Bahasa Inggris**
- Jika ada beberapa pilihan implementasi, jelaskan trade-off-nya secara singkat
- Selalu tunjukkan **struktur file lengkap** sebelum menulis kode jika membuat fitur baru
- Beri tahu jika ada dependency baru yang perlu diinstall

---

## 📦 Modul & Prioritas

### Modul 1: SMM Panel
- Tabel: `smm_packages`, `smm_orders`, `smm_categories`
- Fitur admin: CRUD paket, lihat order masuk, update status order
- Fitur publik: lihat katalog paket, form order, halaman pembayaran
- Status order: `pending` → `paid` → `processing` → `completed` | `failed`

### Modul 2: Wedding Invitation
- Tabel: `wedding_themes`
- Field: `name`, `category`, `price`, `demo_url`, `thumbnail_url`, `is_active`
- Embed demo via iframe dari `demo_url`
- Kategori: Minimalis, Modern, Islami, Rustic, Royal

### Modul 3: Affiliate Management
- Tabel: `affiliate_links`
- Field: `title`, `platform` (shopee/tokopedia/tiktok), `url`, `thumbnail_url`, `tags`, `is_active`
- Bisa dipanggil sebagai komponen di Blog, Ideathon, dan Docs
- Komponen reusable: `<AffiliateCard />`, `<AffiliateGrid />`

### Modul 4: Blog
- Tabel: `blog_posts`, `blog_categories`, `ai_settings`
- Editor: Tiptap (rich text)
- AI generate: panggil AI berdasarkan setting provider di database
- Adsense: komponen `<AdSlot position="header|content|footer" />`
- Status: `draft` | `published` | `scheduled`

### Modul 5: Documentation
- Tabel: `docs_pages`
- Format konten: MDX atau rich text (Tiptap)
- Struktur hierarki: kategori → halaman
- Bisa sisipkan `<AffiliateGrid />` dan `<AdSlot />`

### Modul 6: Ideathon
- Tabel: `ideathon_posts`
- Support embed: YouTube, TikTok, Facebook, Instagram Reels
- Bisa sisipkan affiliate link dan Adsense
- Tag dan kategori ide

---

## 🔧 Cara Claude Harus Menulis Kode

### Server Action vs API Route
- Gunakan **Server Actions** untuk mutasi data dari form di dashboard
- Gunakan **API Routes** untuk webhook (payment notification, dll.)
- Gunakan **Route Handlers** untuk data fetching yang butuh caching

### Error Handling
```typescript
// Selalu gunakan pattern ini untuk Server Actions
export async function createPackage(data: FormData) {
  try {
    // validasi dengan zod
    const validated = packageSchema.parse(Object.fromEntries(data))
    await db.insert(smmPackages).values(validated)
    revalidatePath("/dashboard/smm")
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message }
    }
    return { success: false, error: "Terjadi kesalahan" }
  }
}
```

### Validasi — Selalu Gunakan Zod
```typescript
import { z } from "zod"

export const smmPackageSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  platform: z.enum(["instagram", "tiktok", "youtube", "twitter"]),
  price: z.number().min(1000, "Harga minimal Rp 1.000"),
})
```

---

## 🌐 Format Harga (Rupiah)

Selalu gunakan formatter ini untuk menampilkan harga:
```typescript
export const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
```

---

## 🚨 Peringatan Khusus

1. **Jangan pernah expose API key** di client-side code
2. **Payment webhook** harus selalu divalidasi signature-nya
3. **AI provider API key** disimpan di database (bukan env) karena bisa diganti via dashboard
4. **Adsense script** hanya di-load di halaman publik, bukan di dashboard
5. **Embed URL** harus di-sanitize sebelum dirender sebagai iframe
