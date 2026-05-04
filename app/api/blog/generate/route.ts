import { NextRequest } from "next/server"
import { streamText } from "ai"
import { auth } from "@/lib/auth"
import { getActiveAIConfig, buildProvider } from "@/lib/ai/providers"
import { aiGenerateSchema } from "@/lib/validations/blog"

const lengthMap = { short: "600-800", medium: "1000-1400", long: "1800-2400" }
const toneMap   = {
  formal:      "formal dan profesional",
  casual:      "santai dan mudah dipahami",
  persuasive:  "persuasif dan meyakinkan",
  informative: "informatif dan edukatif",
}
const langMap = { id: "Bahasa Indonesia", en: "English" }

export async function POST(req: NextRequest) {
  // Auth check
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session) return new Response("Unauthorized", { status: 401 })

  const body   = await req.json()
  const input  = aiGenerateSchema.safeParse(body)
  if (!input.success) {
    return new Response(input.error.issues[0]?.message ?? "Invalid input", { status: 400 })
  }

  // Ambil konfigurasi AI aktif
  const config = await getActiveAIConfig()
  if (!config) {
    return new Response(
      "Belum ada provider AI yang aktif. Silakan atur di Settings > AI.",
      { status: 400 }
    )
  }

  const { topic, length, tone, language, keywords } = input.data
  const wordCount = lengthMap[length]
  const toneLabel = toneMap[tone]
  const langLabel = langMap[language]

  const prompt = `Tulis artikel blog ${langLabel} tentang "${topic}".

Instruksi:
- Panjang artikel: ${wordCount} kata
- Nada penulisan: ${toneLabel}
${keywords ? `- Sertakan kata kunci: ${keywords}` : ""}
- Format output: HTML dengan tag yang proper (<h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>)
- Sertakan intro yang menarik, isi dengan sub-heading, dan penutup/kesimpulan
- Jangan sertakan tag <html>, <body>, atau <head>
- Mulai langsung dengan konten artikel
- Gunakan paragraf yang mudah dibaca (maks 4 kalimat per paragraf)

Tulis artikel sekarang:`

  const model  = buildProvider(config)
  const result = streamText({ model, prompt, maxOutputTokens: 3000 })

  return result.toTextStreamResponse()
}
