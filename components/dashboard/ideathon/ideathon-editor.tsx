"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ideathonPostSchema, embedTypes, type IdeathonPostInput } from "@/lib/validations/ideathon"
import { createIdeathonPost, updateIdeathonPost } from "@/lib/actions/ideathon"
import { detectEmbedType } from "@/lib/embed"
import { slugify } from "@/lib/utils"
import { TiptapEditor } from "@/components/dashboard/blog/tiptap-editor"
import { VideoEmbed } from "@/components/shared/video-embed"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, Plus, X, Eye } from "lucide-react"
import { toast } from "sonner"
import { AffiliatePicker } from "@/components/dashboard/shared/affiliate-picker"

interface Category  { id: string; name: string }
interface Affiliate { id: string; title: string; platform: string; url: string; thumbnailUrl: string | null }

interface InitialData {
  id: string; title: string; slug: string; content: string
  thumbnailUrl: string | null; categoryId: string | null
  tags: string[] | null; embedUrl: string | null
  embedType: string | null; adsenseEnabled: boolean | null; isPublished: boolean | null
}

interface Props {
  categories: Category[]
  affiliates:  Affiliate[]
  initialData?: InitialData
}

const embedTypeLabels: Record<string, string> = {
  none: "Tidak ada video", youtube: "▶️ YouTube",
  tiktok: "🎵 TikTok", facebook: "👤 Facebook", instagram: "📸 Instagram",
}

export function IdeathonEditor({ categories, affiliates, initialData }: Props) {
  const router  = useRouter()
  const [isPending, startTransition] = useTransition()
  const [content, setContent]    = useState(initialData?.content ?? "")
  const [tags, setTags]          = useState<string[]>(initialData?.tags ?? [])
  const [newTag, setNewTag]      = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [affiliateOpen, setAffiliateOpen] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm({
      resolver: zodResolver(ideathonPostSchema),
      defaultValues: {
        title:          initialData?.title ?? "",
        slug:           initialData?.slug  ?? "",
        thumbnailUrl:   initialData?.thumbnailUrl ?? "",
        categoryId:     initialData?.categoryId   ?? "",
        embedUrl:       initialData?.embedUrl      ?? "",
        embedType:      (initialData?.embedType as (typeof embedTypes)[number] | undefined) ?? "none",
        adsenseEnabled: initialData?.adsenseEnabled ?? false,
        isPublished:    initialData?.isPublished    ?? false,
        tags:           initialData?.tags ?? [],
        content:        initialData?.content ?? "",
      },
    })

  const titleValue   = watch("title")
  const embedUrl     = watch("embedUrl")
  const embedType    = watch("embedType") ?? "none"
  const adsense      = watch("adsenseEnabled")
  const isPublished  = watch("isPublished")

  function handleTitleBlur() {
    if (!initialData && titleValue) setValue("slug", slugify(titleValue))
  }

  // Auto-detect embed type from URL
  function handleEmbedUrlChange(url: string) {
    setValue("embedUrl", url)
    if (url) {
      const detected = detectEmbedType(url)
      setValue("embedType", detected)
    } else {
      setValue("embedType", "none")
    }
  }

  function addTag() {
    if (!newTag.trim() || tags.includes(newTag.trim())) return
    const updated = [...tags, newTag.trim()]
    setTags(updated); setValue("tags", updated); setNewTag("")
  }

  function removeTag(i: number) {
    const updated = tags.filter((_, idx) => idx !== i)
    setTags(updated); setValue("tags", updated)
  }

  function handleInsertAffiliate(affiliate: Affiliate) {
    const card = `<div class="affiliate-card" data-id="${affiliate.id}">
  <a href="${affiliate.url}" target="_blank" rel="noopener noreferrer sponsored">
    ${affiliate.thumbnailUrl ? `<img src="${affiliate.thumbnailUrl}" alt="${affiliate.title}" />` : ""}
    <p>${affiliate.title}</p>
    <span>${affiliate.platform}</span>
  </a>
</div>`
    setContent((prev) => prev + card)
    setAffiliateOpen(false)
    toast.success("Affiliate link disisipkan ke konten")
  }

  function onSubmit(data: IdeathonPostInput) {
    startTransition(async () => {
      const payload = { ...data, content, tags }
      const res = initialData
        ? await updateIdeathonPost(initialData.id, payload)
        : await createIdeathonPost(payload)
      if (res.success) {
        toast.success(initialData ? "Ide diperbarui!" : "Ide berhasil disimpan!")
        router.push("/dashboard/ideathon")
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main — left 2/3 */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title */}
            <div className="space-y-1.5">
              <Label>Judul Ide *</Label>
              <Input
                placeholder="Contoh: 5 Cara Monetisasi Konten TikTok di 2025"
                className="text-lg h-12"
                {...register("title")}
                onBlur={handleTitleBlur}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input placeholder="cara-monetisasi-tiktok-2025" {...register("slug")} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            {/* Embed video */}
            <div className="space-y-3 p-4 rounded-xl border border-border/50 bg-card/50">
              <Label>Embed Video <span className="text-xs text-muted-foreground">(opsional)</span></Label>
              <Input
                placeholder="Paste URL YouTube, TikTok, Facebook, atau Instagram..."
                value={embedUrl ?? ""}
                onChange={(e) => handleEmbedUrlChange(e.target.value)}
              />
              {embedType !== "none" && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                    Auto-detected: {embedTypeLabels[embedType]}
                  </Badge>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? "Sembunyikan" : "Preview"}
                  </button>
                </div>
              )}
              {showPreview && embedUrl && embedType !== "none" && (
                <VideoEmbed url={embedUrl} type={embedType as any} />
              )}
            </div>

            {/* Content editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Konten / Deskripsi Ide</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs border-primary/40 text-primary hover:bg-primary/10"
                  onClick={() => setAffiliateOpen(true)}
                >
                  🛍️ Sisipkan Affiliate
                </Button>
              </div>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>

          {/* Sidebar — right 1/3 */}
          <div className="space-y-5">

            {/* Publish settings */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Pengaturan Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Kategori</Label>
                  <Select
                    defaultValue={initialData?.categoryId ?? ""}
                    onValueChange={(v) => setValue("categoryId", v || "")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tanpa kategori</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Thumbnail URL</Label>
                  <Input placeholder="https://..." {...register("thumbnailUrl")} />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Tambah tag..."
                      className="h-8 text-sm"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                    />
                    <Button type="button" size="sm" variant="outline" className="h-8" onClick={addTag}>
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {tags.map((t, i) => (
                        <Badge key={i} variant="secondary" className="text-xs gap-1">
                          {t}
                          <button type="button" onClick={() => removeTag(i)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Adsense */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Google Adsense</p>
                    <p className="text-xs text-muted-foreground">Tampilkan iklan di halaman ini</p>
                  </div>
                  <Switch
                    checked={adsense ?? false}
                    onCheckedChange={(v) => setValue("adsenseEnabled", v)}
                  />
                </div>

                {/* Published */}
                <div className="flex items-center justify-between border-t border-border/30 pt-3">
                  <div>
                    <p className="text-sm font-medium">Publish</p>
                    <p className="text-xs text-muted-foreground">Tampilkan ke publik</p>
                  </div>
                  <Switch
                    checked={isPublished ?? false}
                    onCheckedChange={(v) => setValue("isPublished", v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/dashboard/ideathon")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 gradient-brand text-white hover:opacity-90"
              >
                {isPending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</>
                  : <><Save className="w-4 h-4 mr-2" />Simpan</>
                }
              </Button>
            </div>
          </div>
        </div>
      </form>

      <AffiliatePicker
        open={affiliateOpen}
        onClose={() => setAffiliateOpen(false)}
        affiliates={affiliates}
        onSelect={handleInsertAffiliate}
      />
    </>
  )
}
