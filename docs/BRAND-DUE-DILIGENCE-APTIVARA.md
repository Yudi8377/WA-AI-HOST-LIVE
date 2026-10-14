# Brand Due Diligence — Aptivara

Date checked: 2026-10-14
Status: preliminary open-web screening only; not legal clearance and not a domain availability check.

## Proposed brand
- Name: Aptivara
- Tagline: Adaptive Intelligence. Connected Business.
- Positioning: global multi-agent adaptive AI and omnichannel business platform for UMKM/SMBs through Enterprise.

## Preliminary findings

1. **Exact-name commercial use exists.** Public search results identify Aptivara RCM, LLC, an active Virginia business formed in March 2026, with a live website at https://aptivararcm.com/. Its service is revenue-cycle/medical billing and public company materials describe it in technology/software terms. This is a meaningful exact-name collision risk even though its current market differs from our proposed SaaS.
2. **The exact .com domain appears to have been registered previously.** Search results list aptivara.com in a newly registered domain archive dated 2024. That does not establish its present ownership, current DNS state, price, or availability for purchase. Do not assume aptivara.com is available.
3. **Similar company name exists.** Aptivora Global Solutions is a software/AI and IT services company at https://www.aptivoraglobalsolutions.com/. The spelling differs by one letter but is phonetically similar and operates in adjacent technology services, increasing confusion risk.
4. **Trademark status is not cleared.** General web search did not provide conclusive official trademark clearance for the exact word across Indonesia and intended international markets. Official database searches, relevant classes, status/owner review, and legal advice are still required.

## Preliminary recommendation

**Do not yet treat Aptivara as the final public brand, buy domains, or rename repository/infrastructure.** Mark it as a candidate with elevated collision risk pending official clearance. Because the business intends to operate globally in software/AI, an exact existing business plus a similar software company is enough to justify evaluating alternatives before investing in a visual identity or launch.

Potential next action: generate a new batch of more distinctive coined names and screen each one for exact/phonetic company names, domains, app stores, social handles, and trademark records. Only shortlist candidates that pass an initial screen, then perform formal trademark/legal clearance.

## Official checks to complete before final approval

- Indonesia: search PDKI at https://pdki-indonesia.dgip.go.id/ for exact, partial, and phonetic marks; check relevant software/SaaS, AI, communication, and business-service classes with qualified IP counsel.
- International: search WIPO Global Brand Database at https://branddb.wipo.int/ and trademark registers for priority launch markets.
- Domain: check registrar/ICANN RDAP for the exact domain and relevant alternatives; verify current status, ownership/marketplace terms, renewal history and price before purchase.
- Company/product: search app stores, GitHub, major search engines, and social networks for exact and confusingly similar use.
- Record evidence and review date; domain availability and trademark status can change.

## Safe rebranding plan (no infrastructure changes yet)

### Phase 0 — Candidate screening
- Keep repository name WA-AI-HOST-LIVE, all Neon project/branch/database identifiers, environment variable names, API endpoints, OAuth/provider settings, deployment URLs, and production data unchanged.
- Do not buy a domain, file a mark, or announce the candidate as final until clearance and owner approval.
- Keep Aptivara as a provisional internal candidate only.

### Phase 1 — Brand decision
- Approve one name after screening and legal review.
- Define canonical display name, tagline, capitalization, logo rules, product naming, and redirect/legacy-name policy.

### Phase 2 — Reversible in-repo display changes
- In a dedicated branch/PR, update README title, product copy, dashboard title/metadata, docs and non-secret examples only.
- Keep technical IDs, package identifiers, database names, Neon project/branch IDs, secrets, and external integration settings unchanged.
- Add a terminology map for old-to-new names; run lint, typecheck, tests, build, link checks, and secret scanning.

### Phase 3 — Controlled public rollout
- Merge only after CI and review; deploy to preview first.
- Verify auth redirects, CORS allowlists, GitHub Pages paths, callback URLs, SEO metadata, canonical URLs, and all docs links.
- Update public display name and domain only after domain ownership and TLS/DNS are confirmed. Add redirects if changing URLs.

### Phase 4 — Technical rename only if justified
- Rename the GitHub repository after inventorying workflows, remote URLs, badges, external integrations and webhook references.
- Keep Neon project/branch/database identifiers unless a separate, justified migration is approved; changing display labels is distinct from recreating infrastructure.
- Never rotate or print secrets merely to change branding. Update provider dashboards only where a verified callback/allowed-origin change is required.
- Verify end-to-end auth, webhook, health checks and production rollback before closing the rebrand.

## Decision log
- User selected Aptivara and tagline on 2026-10-14 for initial screening.
- User explicitly instructed not to rename repository, Neon project/database, or production configuration until the candidate has been checked and final name confirmed.
- No infrastructure or production configuration was changed during this screening.
