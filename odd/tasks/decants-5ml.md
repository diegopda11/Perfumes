# Feature: decants-5ml

## Objective
Offer a 5 ml decant alongside the 10 ml one, with the owner's prices, and publish it.

## Problem / why
The owner now sells two sizes. The site only models and shows 10 ml (constitution: "sin selector de tamaño por ahora"), so customers cannot see the 5 ml option or ask for it on WhatsApp.

## Scope
- Data: optional `price5ml` next to `price` in each catalog entry (easy to edit on GitHub); maps to `presentations` [{10}, {5}].
- Prices: Azzaro TMW Intense 220/130 · Club de Nuit Urban Man Elixir 180/100 · Nitro Red 150/90 · Qaed Al Fursan 130/80.
- Product page: size choice (10 ml default, 5 ml); price and WhatsApp message follow the chosen size.
- Cards and hero: show both prices when a perfume has 5 ml.
- Copy that says only "10 ml" generalized where it describes the offer.
- Spec 003 + constitution amendment; README and /nuevo-perfume skill updated.

## Constraints
- WhatsApp stays the only conversion point (product page only).
- Perfumes without `price5ml` keep working exactly as before.
- Static export; `npm run build` (postbuild) before e2e.

## Delivery
Strategy: single-pr (one feature branch `feat/decants-5ml`, merged to main and pushed because the owner asked to publish). Forecast ~350 authored lines.

## Tasks
- [x] T1 Spec 003 + constitution amendment (route: delegated writer — 2+ non-trivial files) — commit 5c6152f
- [x] T2 Data model `price5ml`, catalog prices, README, nuevo-perfume skill (delegated writer) — commit 8103a4a
- [x] T3 UI: product-page size choice + WhatsApp size, cards, hero, copy (delegated writer) — commit 7842ec6
- [x] T4 Tests: unit + e2e for both sizes; full check suite (delegated writer; tests committed with T2/T3; parent spot check pending)
- [x] T5 Merge to main, push, verify live (parent) — native review medium/granted, approved and acknowledged (lineage review-fc6c2edcc10da719); advisory fix 7b69c13 (About missing space, under_budget); main fast-forwarded to 7b69c13 and pushed; live product page shows "Tamaño del decant" and the new prices after ~40 s

## Acceptance criteria
- Each product page offers 10 ml and 5 ml with the right prices; WhatsApp text names the chosen size.
- Cards and hero show both prices.
- tsc, lint, unit and e2e pass.
- Live site shows the new prices.

## Progress / evidence
- Branch created: feat/decants-5ml.
- T1/T2/T3 done by the delegated writer on feat/decants-5ml.
- Test-first: tests/unit/presentations.test.ts written first; RED observed (module missing, then 4 price assertions and priceListParts failing), GREEN after implementation.
- Design: `lib/presentations.ts` (toPresentations, formatSizes, priceListParts, formatPriceList, catalogSizes); `SizeContext` client provider wraps the product page so PriceBlock (radio pills in a fieldset "Tamaño del decant"), WhatsAppButton, StickyWhatsAppBar and "Lo que recibes" share the chosen size; cards and hero render all prices via `PriceParts` (wraps only between sizes); home/footer/about/catalog/metadata copy uses `offeredSizes()` derived from data.
- Checks (final run): `npx tsc --noEmit` exit 0; `npm run lint` exit 0; `npm test` 75 passed; `npm run test:e2e` 53 passed, 7 skipped (project-specific skips), exit 0.
- Visual check: screenshots of product page (desktop/mobile), home hero (desktop/mobile) and catalog cards (mobile) reviewed.
- Size: ~632 insertions / 79 deletions ignoring whitespace (page.tsx reindented inside SizeProvider; CRLF preserved). Over the ~400 heuristic because spec, docs and e2e travel with the behavior; strategy single-pr kept.
- Pending: photo of the real 5 ml decant (scenes show the 10 ml one; alt texts made neutral where they followed the selection). T5 (merge/push/verify live) is the parent's.

## Next step
Parent spot check, then T5.
