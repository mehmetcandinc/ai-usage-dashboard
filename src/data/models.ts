import type { Provider, Tier } from '../types/usage'

// Model kataloğu: hangi model hangi sağlayıcıya ve kademeye ait.
// Fiyatlar burada değil; fiyat adımında LiteLLM dosyasından gelecek.
// Not: Model adları fiyat adımında LiteLLM'deki adlarla eşleştirilecek.

export type ModelInfo = {
  provider: Provider
  model: string
  tier: Tier
}

export const MODEL_CATALOG: readonly ModelInfo[] = [
  { provider: 'anthropic', model: 'claude-haiku-5-5', tier: 'basic' },
  { provider: 'anthropic', model: 'claude-sonnet-5-5', tier: 'mid' },
  { provider: 'anthropic', model: 'claude-opus-5-5', tier: 'pro' },
  { provider: 'openai', model: 'gpt-5-nano', tier: 'basic' },
  { provider: 'openai', model: 'gpt-5-mini', tier: 'mid' },
  { provider: 'openai', model: 'gpt-5', tier: 'pro' },
  { provider: 'google', model: 'gemini-2.5-flash-lite', tier: 'basic' },
  { provider: 'google', model: 'gemini-2.5-flash', tier: 'mid' },
  { provider: 'google', model: 'gemini-2.5-pro', tier: 'pro' },
]
