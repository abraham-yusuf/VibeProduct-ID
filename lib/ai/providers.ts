import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { db } from "@/lib/db"
import { aiSettings } from "@/lib/db/schema/blog"
import { eq } from "drizzle-orm"

export type AIProvider = "openai" | "anthropic" | "openrouter"

export interface AIConfig {
  provider: AIProvider
  apiKey:   string
  model:    string
}

// Default models per provider
export const defaultModels: Record<AIProvider, string> = {
  openai:     "gpt-4o-mini",
  anthropic:  "claude-sonnet-4-20250514",
  openrouter: "openai/gpt-4o-mini",
}

export function buildProvider(config: AIConfig) {
  switch (config.provider) {
    case "openai":
      return createOpenAI({ apiKey: config.apiKey })(config.model)
    case "anthropic":
      return createAnthropic({ apiKey: config.apiKey })(config.model)
    case "openrouter":
      return createOpenRouter({ apiKey: config.apiKey })(config.model)
    default:
      throw new Error(`Unknown provider: ${config.provider}`)
  }
}

// Ambil provider aktif dari database
export async function getActiveAIConfig(): Promise<AIConfig | null> {
  const setting = await db.query.aiSettings.findFirst({
    where: eq(aiSettings.isActive, true),
  })
  if (!setting) return null
  return {
    provider: setting.provider as AIProvider,
    apiKey:   setting.apiKey,
    model:    setting.model,
  }
}