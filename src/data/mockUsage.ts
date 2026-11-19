import type { Tier, UsageRecord } from '../types/usage'
import { MODEL_CATALOG } from './models'

// Sahte (mock) kullanım verisi üretici.
// "Tohumlu" (seeded) rastgele sayı kullanır: aynı seed => her seferinde aynı veri.
// Böylece grafikler her yenilemede değişmez ve testler tekrarlanabilir olur.

/** Basit, tohumlu rastgele sayı üreteci (mulberry32). 0 ile 1 arası sayı döner. */
function createRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Kademelere göre kullanım ağırlığı: ucuz modeller daha sık kullanılır.
const TIER_WEIGHT: Record<Tier, number> = { basic: 5, mid: 3, pro: 1 }

// Kademelere göre tipik token aralıkları [min, max]
const TOKEN_RANGE: Record<Tier, { input: [number, number]; output: [number, number] }> = {
  basic: { input: [200, 3_000], output: [50, 800] },
  mid: { input: [1_000, 12_000], output: [200, 2_500] },
  pro: { input: [3_000, 40_000], output: [500, 6_000] },
}

const ERROR_RATE = 0.04 // çağrıların ~%4'ü hata

export type MockOptions = {
  /** Kaç günlük veri (bugünden geriye) */
  days?: number
  /** Günlük ortalama çağrı sayısı */
  callsPerDay?: number
  seed?: number
  /** Son gün; varsayılan: şimdi */
  endDate?: Date
}

export function generateMockUsage(options: MockOptions = {}): UsageRecord[] {
  const { days = 30, callsPerDay = 40, seed = 42, endDate = new Date() } = options
  const random = createRandom(seed)
  const between = (min: number, max: number) => Math.round(min + random() * (max - min))

  // Ağırlıklı model seçimi için havuz: basic modeller 5 kez, pro modeller 1 kez yer alır.
  // Not: Array(n).fill(m) tipi kaybettirir (any[]); Array.from tipi korur.
  const pool = MODEL_CATALOG.flatMap((m) => Array.from({ length: TIER_WEIGHT[m.tier] }, () => m))

  const records: UsageRecord[] = []
  const dayMs = 24 * 60 * 60 * 1000

  for (let d = days - 1; d >= 0; d--) {
    const dayStart = endDate.getTime() - (d + 1) * dayMs
    const count = between(callsPerDay * 0.5, callsPerDay * 1.5)

    for (let i = 0; i < count; i++) {
      const m = pool[Math.floor(random() * pool.length)]
      const range = TOKEN_RANGE[m.tier]
      const isError = random() < ERROR_RATE
      const totalInput = between(...range.input)
      // Girdinin %0-60'ı önbellekten gelsin
      const cachedTokens = Math.round(totalInput * random() * 0.6)

      records.push({
        id: `mock-${d}-${i}`,
        timestamp: new Date(dayStart + random() * dayMs).toISOString(),
        provider: m.provider,
        model: m.model,
        tier: m.tier,
        inputTokens: totalInput - cachedTokens,
        // Hatalı çağrıda model cevap üretmez
        outputTokens: isError ? 0 : between(...range.output),
        cachedTokens,
        status: isError ? 'error' : 'success',
        source: 'mock',
      })
    }
  }

  return records.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}
