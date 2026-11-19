# AI Usage Dashboard

LLM API çağrılarını izleyen panel: istek sayısı, token, maliyet, model dağılımı, hata oranı, kademe karşılaştırması ("aynı token'lar başka modelde ne tutardı").

## Teknoloji
React 19 + TypeScript + Vite 8 + Tailwind CSS v4. Sonraki adımlarda: React Router, Recharts, Zustand, TanStack Query/Table, Vitest.

## Çalışma kuralları
- İş takibi GitHub Projects panosunda ("AI Usage Dashboard"). Her adım bir issue; commit mesajında `Closes #N`.
- Önce mock veri; ileride BrandCraft AI projesinin gerçek kullanım verisi bağlanacak, veri modeli buna uygun tasarlanır.
- Kararlar `docs/kararlar.md` dosyasına, plan `docs/plan.md` dosyasına yazılır.
- Komutlar: `npm run dev` (geliştirme), `npm run build` (derleme), `npm run lint`.
