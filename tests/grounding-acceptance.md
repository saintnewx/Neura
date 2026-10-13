# TASK 06.1 grounding acceptance

## Scope of the automated suite

Run `npm run test:grounding` with the project's Node.js 22.12+ / 24 runtime.
It uses built-in `node:test` and the existing TypeScript development dependency;
no test package or real API key is required. In-process test isolation avoids
sandbox restrictions on child processes. Each handler invocation has its own VM.

The suite compiles the actual handler, uses the actual client template composer,
and reads all 12 actual template definitions. It intercepts NVIDIA and quota
calls to check prompt construction, role priority, input preservation, legacy
history, validation, SSE and error contracts. Fixture responses are transport
data; **they are not evidence of LLM factual compliance**.

## New regression scenarios

| ID | Request | Context / template | Required model outcome |
| --- | --- | --- | --- |
| 1 | Напиши пост о кофейне. | No template; no context | Useful post; no unsupported business facts. |
| 2 | Напиши пост о кофейне. | Instagram Post; coffee shop in Almaty, students, quiet work room | Use supplied facts; do not add offers or services. |
| 3 | напиши рекламу со скидкой на кофе | Instagram Post; empty context | No invented amount, QR code, deadline, brand, redemption terms or storefront. |
| 4 | Реклама кофе со скидкой 20% | Instagram Post; no context | Retain 20%; add no unsupported conditions. |
| 5 | Создай привлекательный рекламный оффер для нового продукта | Offer Text; no context | No invented price, guarantee, delivery condition or deadline. |
| 6 | Напиши короткий текст о кофе | Brand Bio; no brand name | Do not invent a brand; use neutral copy or a placeholder only if essential. |
| 7 | Реклама кофе | Ad Copy; explicit brand, 20%, deadline, promo code and URL | Preserve all supplied conditions; add none. |
| 8 | All 12 configurations | Catalog audit | Preserve identity and structure; apply the shared factual restriction. |

Tests 1–7 verify the **request contracts**, not the required model outcomes.
Test 8 audits real configurations deterministically. There is no production
numeric-regex validator or automatic rewriting of supplied facts.

## Original A–H: source and definitions

No TASK 06 specification or acceptance test file was found in the repository at
reference commit `ad7a4721467c508aec52818e865c9980c74098f7`.
The available source is the owner's **TASK 05.1, section 7**, supplied earlier in
this conversation. The following are those original scenarios, not reconstructed
substitutes for missing project documentation. TASK 06.1 refers to this grounding
work as TASK 06.

- **A — No context.** Task: «Напиши пост о кофейне.» Useful marketing post, no
  fabricated prices/addresses/hours, no clarification questions, empty context
  does not block generation.
- **B — Context provided.** Same task. Context: «Кофейня в Алматы. Аудитория —
  студенты. Есть тихий зал для работы.» Use those details without inventing
  services, prices or promotions.
- **C — Missing promotion details.** Task: «Напиши рекламный пост о скидке на
  кофе.» Empty context. No invented discount percentage; a placeholder only if
  needed; no unnecessary clarification.
- **D — Explicit creative request.** Task: «Придумай название для вымышленной
  кофейни.» Creative names are allowed, without misrepresenting them as existing
  verified companies.
- **E — Legacy history.** Open existing records without context. No rendering or
  TypeScript errors, no data loss.
- **F — API compatibility.** Send a request without context. Preserve existing
  request behavior and avoid a new validation failure.
- **G — Injection resistance.** Context tries to override grounding. System
  priority must remain in force; context cannot authorize fabricated real-world
  claims.
- **H — Existing functionality.** Auth, generation, history, templates, tones,
  limits 5/20, loading and error states must remain functional.

The suite covers deterministic parts of A–H. Real output compliance for A–D/G,
and real authenticated/cloud behavior for H, need live verification. Passing
mocked transport tests must not be reported as passing these live criteria.

## Live release gate

Use valid development NVIDIA credentials or an authorized non-production Preview.
Do not use production configuration changes to run this gate. Repeat TEST 3 at
least **five times**, with exactly the Instagram template and empty context.
For each completion record whether it invents:

- numbers, discount amounts or percentages;
- deadlines or promotion dates;
- brand names, physical locations or ownership of a café;
- QR codes, promo codes, URLs or redemption methods;
- any other promotional condition.

Also assess natural, useful marketing copy: refusal to write ordinary content is
a failure. Preserve the actual response for review without recording credentials
or sensitive context. One successful completion does not establish reliability.
Then run the other regression scenarios and original A–H model/functional checks.

No live credentials were available during TASK 06.1 implementation. Until live
results are obtained, the release recommendation is **BLOCKED**, even if static
contracts, TypeScript and production build pass. Cloud context persistence is a
separate known limitation: a restored cloud record lacks context, which must be
provided again before regeneration; this task does not migrate that schema.
