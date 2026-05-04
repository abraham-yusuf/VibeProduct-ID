"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { aiGenerateSchema, type AiGenerateInput } from "@/lib/validations/blog"
// NOTE: Use plain fetch to keep client integration simple.
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Check } from "lucide-react"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
  onGenerated: (html: string) => void
}

export function AIGenerateModal({ open, onClose, onGenerated }: Props) {
  const [done, setDone] = useState(false)
  const [completion, setCompletion] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm({
      resolver: zodResolver(aiGenerateSchema),
      defaultValues: { length: "medium", tone: "informative", language: "id" },
    })

  async function onSubmit(data: AiGenerateInput) {
    setDone(false)
    setIsLoading(true)
    setCompletion("")

    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Gagal generate konten")
      }

      const text = await res.text()
      setCompletion(text)
      setDone(true)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error(error instanceof Error ? error.message : "Gagal generate konten")
    }
  }

  function handleUse() {
    if (!completion) return
    onGenerated(completion)
    onClose()
    setDone(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Generate Konten dengan AI
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Topik Artikel *</Label>
            <Input placeholder="Contoh: Tips meningkatkan followers Instagram organik" {...register("topic")} />
            {errors.topic && <p className="text-xs text-destructive">{errors.topic.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Kata Kunci SEO <span className="text-xs text-muted-foreground">(opsional, pisahkan koma)</span></Label>
            <Input placeholder="followers instagram, cara dapat followers, SMM" {...register("keywords")} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Panjang Artikel</Label>
              <Select defaultValue="medium" onValueChange={(v) => setValue("length", v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Pendek (~700 kata)</SelectItem>
                  <SelectItem value="medium">Sedang (~1200 kata)</SelectItem>
                  <SelectItem value="long">Panjang (~2000 kata)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Nada Tulisan</Label>
              <Select defaultValue="informative" onValueChange={(v) => setValue("tone", v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informative">Informatif</SelectItem>
                  <SelectItem value="casual">Santai</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="persuasive">Persuasif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Bahasa</Label>
              <Select defaultValue="id" onValueChange={(v) => setValue("language", v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">🇮🇩 Indonesia</SelectItem>
                  <SelectItem value="en">🇬🇧 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-brand text-white hover:opacity-90"
          >
            {isLoading
              ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
              : <><Sparkles className="w-4 h-4 mr-2" /> Generate Sekarang</>
            }
          </Button>
        </form>

        {/* Preview hasil */}
        {(isLoading || completion) && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label>Preview Hasil</Label>
              {done && (
                <Button
                  size="sm"
                  className="gradient-brand text-white hover:opacity-90"
                  onClick={handleUse}
                >
                  <Check className="w-4 h-4 mr-1.5" /> Gunakan Konten Ini
                </Button>
              )}
            </div>
            <div
              className="max-h-80 overflow-y-auto p-4 rounded-xl border border-border/50 bg-muted/30 prose prose-invert prose-sm max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: completion }}
            />
            {isLoading && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> Menulis artikel...
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
