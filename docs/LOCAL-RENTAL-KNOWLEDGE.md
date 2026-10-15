# Local rental knowledge pack

The app bundles `lib/rental-knowledge.ts` with the frontend. Routine questions are handled without runtime web lookups through a deterministic pipeline: intent classification, local retrieval, safety/policy guardrail, response composition. It is not an LLM; unknown or high-risk questions must be escalated.

## Coverage
45 local knowledge topics and 20 regression scenarios cover pricing, availability, fleet selection, self-drive eligibility, drivers, pickups/airport, duration/extensions, booking/changes/cancellation, payments/deposits/invoices, fuel/tolls/parking, overtime/returns, accidents/breakdowns/insurance/fines, lost items, cleanliness/pets/child seats/accessibility, corporate/event/out-of-city rentals, mileage, contracts/documents, weather, privacy, fraud, complaints, and human handoff.

## Important limits
- All fleet/prices in the demo are fictional; replace them with tenant-approved data before selling.
- Local memory cannot know live fleet availability, current traffic, active promotions, payment state, or a booking status unless connected to an authoritative tenant system.
- Never claim a booking, payment, refund, discount, insurance coverage, or unit availability is confirmed without verified data.
- Customer messages must never rewrite tenant policies. Version and audit knowledge updates.
- Collect only necessary personal data and follow tenant privacy/retention rules.

## Reference literature used to shape scenario coverage
These are references for scenario taxonomy and general operating patterns, not policies to copy into an Indonesian rental business. All prices and jurisdiction-specific terms on foreign sites must not be reused.

- Indonesia, UU 27/2022 on Personal Data Protection, official JDIH Komdigi: https://jdih.komdigi.go.id/produk_hukum/view/id/832/t/undangundang%2Bnomor%2B27%2Btahun%2B2022
- SIXT Help Center, rental scenarios: https://www.sixt.com/help-center/
- SIXT rental agreement information: https://www.sixt.com/help-center/sections/rental-agreement-information/
- SIXT deposits and card authorizations: https://www.sixt.com/help-center/sections/deposits-and-card-authorizations/
- SIXT full-to-full fuel policy: https://www.sixt.com/help-center/articles/how-does-sixt-s-full-to-full-fuel-policy-work/
- SIXT damage claims: https://www.sixt.com/help-center/articles/how-does-sixt-handle-a-damage-claim-on-a-rental-car/
- Enterprise general car rental FAQs: https://www.enterprise.com/en/car-rental-faqs/us-general.html
- Enterprise fuel FAQ: https://www.enterprise.com/en/car-rental-faqs/us-general/fueling-rental-car.html
- Enterprise late return policy: https://www.enterprise.com/en/car-rental-faqs/us-reservations/late-returns-policy.html

## Release gate
Before a paid launch: load tenant-approved fleet/prices/policies; connect live inventory and booking data; secure tenant-scoped storage; test multi-turn, misspellings, code-switching, prompt injection, and high-risk cases; connect official WhatsApp runtime and consent/opt-out controls; and review privacy, terms, and support escalation. Run `npm run check:rental-knowledge` for local coverage assertions.
