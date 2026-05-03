"use client"

import { useState, useTransition } from "react"
import { upsertAiSetting } from "@/lib/actions/blog"
import { defaultModels, type AIProvider } from "@/lib/ai/providers"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface Setting {
  id: string; provider: string; apiKey: string
  model: string; isActive: boolean | null
}

interface Props { initialSettings: Setting[] }

const providerConfig: Record<AIProvider, {
  label: string; description: string; docsUrl: string; color: string
  models: string[]
}> = {
  openai: {
    label: "OpenAI",
    description: "GPT-4o, GPT-4o Mini, GPT-4 Turbo",
    docsUrl: "https://platform.openai.com/api-keys",
    color: "bg-green-500/15 text-green-400 border-green-500/25",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  },
  anthropic: {
    label: "Anthropic",
    description: "Claude Sonnet, Claude Haiku",
    docsUrl: "https://console.anthropic.com/",
    color: "bg-orange-500/15 text-orange-400 border-orange-500/25",
    models: ["claude-sonnet-4-20250514", "claude-haiku-4-5-20251001"],
  },
  openrouter: {
    label: "OpenRouter",
    description: "Akses 100+ model AI dalam satu API",
    docsUrl: "https://openrouter.ai/keys",
    color: "bg-violet-500/15 text-violet-400 border-violet-500/25",
    models: ["openai/gpt-4o-mini", "openai/gpt-4o", "anthropic/claude-3.5-sonnet", "meta-llama/llama-3.1-8b-instruct:free"],
  },
}

const providers: AIProvider[] = ["openai", "anthropic", "openrouter"]

export function AISettingsForm({ initialSettings }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showKey, setShowKey]        = useState<Record<string, boolean>>({})
  const [formState, setFormState]    = useState<Record<string, { apiKey: string; model: string; isActive: boolean }>>(() => {
    const state: Record<string, any> = {}
    for (const p of providers) {
      const existing = initialSettings.find((s) => s.provider === p)
      state[p] = {
        apiKey:   existing?.apiKey ?? "",
        model:    existing?.model ?? defaultModels[p],
        isActive: existing?.isActive ?? false,
      }
    }
    return state
  })

  function handleChange(provider: AIProvider, field: "apiKey" | "model", value: string) {
    setFormState((prev) => ({ ...prev, [provider]: { ...prev[provider], [field]: value } }))
  }

  function handleSave(provider: AIProvider) {
    const data = formState[provider]
    if (!data.apiKey.trim()) { toast.error("API key wajib diisi"); return }

    startTransition(async () => {
      const res = await upsertAiSetting({
        provider,
        apiKey:   data.apiKey,
        model:    data.model,
        isActive: data.isActive,
      })
      if (res.success) toast.success(`Pengaturan ${providerConfig[provider].label} disimpan`)
      else toast.error(res.error)
    })
  }

  function handleSetActive(provider: AIProvider) {
    setFormState((prev) => {
      const updated = { ...prev }
      for (const p of providers) updated[p] = { ...updated[p], isActive: p === provider }
      return updated
    })
  }

  return (
    <div className="space-y-5">
      {/* Info box */}
      <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 text-sm text-muted-foreground">
        💡 Hanya <strong className="text-foreground">satu provider</strong> yang aktif sekaligus.
        Provider aktif akan digunakan untuk semua fitur generate konten.
      </div>

      {providers.map((provider) => {
        const cfg    = providerConfig[provider]
        const state  = formState[provider]
        const isActive = state.isActive

        return (
          <Card
            key={provider}
            className={`border transition-all duration-200 ${
              isActive ? "border-primary/50 shadow-md shadow-primary/5" : "border-border/50"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={cfg.color}>{cfg.label}</Badge>
                  {isActive && (
                    <Badge className="bg-green-500/15 text-green-400 border-green-500/25 text-xs gap-1">
                      <Check className="w-3 h-3" /> Aktif
                    </Badge>
                  )}
                </div>
                {!isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => handleSetActive(provider)}
                  >
                    Set Aktif
                  </Button>
                )}
              </div>
              <CardDescription>{cfg.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* API Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>API Key</Label>
                  <a
                    href={cfg.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Dapatkan API Key →
                  </a>
                </div>
                <div className="relative">
                  <Input
                    type={showKey[provider] ? "text" : "password"}
                    placeholder={`Masukkan ${cfg.label} API key...`}
                    value={state.apiKey}
                    onChange={(e) => handleChange(provider, "apiKey", e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowKey((p) => ({ ...p, [provider]: !p[provider] }))}
                  >
                    {showKey[provider]
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              {/* Model */}
              <div className="space-y-1.5">
                <Label>Model</Label>
                <div className="flex gap-2 flex-wrap">
                  {cfg.models.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleChange(provider, "model", m)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                        state.model === m
                          ? "gradient-brand text-white border-transparent"
                          : "border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <Input
                  placeholder="Atau ketik model kustom..."
                  value={state.model}
                  onChange={(e) => handleChange(provider, "model", e.target.value)}
                  className="mt-2 text-sm"
                />
              </div>

              <Button
                onClick={() => handleSave(provider)}
                disabled={isPending}
                className="w-full gradient-brand text-white hover:opacity-90"
              >
                {isPending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                  : `Simpan Pengaturan ${cfg.label}`
                }
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}