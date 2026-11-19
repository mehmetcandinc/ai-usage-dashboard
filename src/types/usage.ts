// Bir yapay zeka API çağrısının kaydı.
// Maliyet burada TUTULMAZ: token sayılarından, güncel fiyat tablosuyla hesaplanır
// (bkz. docs/kararlar.md, 2026-11-19).

export type Provider = 'anthropic' | 'openai' | 'google'

/** Modelin kademesi: ucuz / orta / güçlü */
export type Tier = 'basic' | 'mid' | 'pro'

export type CallStatus = 'success' | 'error'

/** Kaydın nereden geldiği */
export type UsageSource = 'mock' | 'claude-code' | 'brandcraft'

export type UsageRecord = {
  id: string
  /** ISO 8601 tarih-saat, ör. "2026-11-19T14:03:00.000Z" */
  timestamp: string
  provider: Provider
  model: string
  tier: Tier
  /** Modele gönderilen token (önbellekten okunanlar hariç) */
  inputTokens: number
  /** Modelin ürettiği token */
  outputTokens: number
  /** Önbellekten okunan token (normal girdiden çok daha ucuz) */
  cachedTokens: number
  status: CallStatus
  source: UsageSource
}
