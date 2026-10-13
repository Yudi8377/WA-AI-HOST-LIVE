# WA AI HOST LIVE — Design Context

## Product
An Indonesian-first command center for small and growing commerce teams managing conversations across official messaging and commerce channels. The current route is a simulator dashboard, not a marketing landing page. Its purpose is to demonstrate the operator workflow and clearly disclose which data is mocked.

## Visual direction
**Quiet operational confidence**: a reliable seller workspace, not a neon AI lab. The signature is the compact green broadcast mark and calm green command surface against a pale mineral canvas. Density is intentional, but every conversation remains readable.

## Tokens
- Ink: #172820
- Muted text: #77847C
- Canvas: #F6F8F6
- Surface: #FFFFFF
- Border: #E6EBE7
- Brand green: #167454
- Brand deep: #0E5C42
- Brand tint: #E7F4ED
- Typography: Manrope for display/strong labels; DM Sans for body and controls. Arial fallback remains.
- Radius: 9px controls, 11–13px cards; low-elevation surfaces.

## Interaction contract
- Indonesian UI, clear active navigation, visible keyboard focus, semantic buttons/inputs, responsive sidebar, reduced-motion support.
- Simulator data is explicitly labelled as sample data. Never present sample numbers as actual sales, customers, or connected platform metrics.
- Actions without a backend respond with a clear simulator message; they must not imply a real message was sent or a platform connected.
- AI suggestions are drafts for human review, not automatically sent.
- Risky actions, account changes, purchases, refunds, and externally visible actions require server-side authorization and policy gates.
- Keep secrets out of browser bundles and Git.