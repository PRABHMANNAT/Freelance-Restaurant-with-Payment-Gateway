# Kale Da Dhaba implementation audit

Audited on 14 September 2026 against the local Vite app and the deployed reference at `https://kaledadhaba.vercel.app/`.

## Scope and baseline

The requested `Kale_Da_Dhaba_Audit_and_Codex_Prompts.md` attachment was not present in the repository or workspace at audit time. This document separates findings reproduced from the current application from design recommendations in the supplied brief.

- Browser baselines captured with the supported browser tools at **1440 × 900** and **390 × 844**.
- The local and deployed versions have the same homepage structure at capture time: announcement bar, floating rounded header and pill navigation, split hero, value strip, featured dish cards, story, reviews, final CTA, and footer.
- Mobile has no observed document-width overflow at 390 px, and the cart opens through its compact header control.

## Observed implementation

| Area | Reproduced finding | Source location |
| --- | --- | --- |
| Routes | Hash routes include home, about, menu, reviews, gallery, contact, checkout, confirmation and dashboard. | `src/main.jsx` — `routes`, `currentRoute`, `App` |
| Cart totals | The header cart, drawer and checkout receive one `calculateTotals(items)` result. Order snapshots call the same helper. | `src/main.jsx` — `App`; `src/domain.js` — `calculateTotals`, `createOrder` |
| Local demo isolation | Cart, orders, customer draft and reviews use browser storage key `kdd-demo-v1`; no fetch, payment SDK or messaging dispatch is present. | `src/domain.js` — `STORAGE_KEY`, `readSaved`, `notification`; `src/main.jsx` — `App`, `Dashboard` |
| Checkout safeguards | Required customer fields validate, payment panels are simulated and completion is deduplicated by order ID. | `src/domain.js` — `validateCustomer`, `createOrder`; `src/main.jsx` — `Checkout`, `complete` |
| Focus and scroll | Skip link focuses `main`; cart uses a focus trap; checkout focuses the first invalid field. Hash changes currently scroll to top but do not move focus to the newly rendered page heading. | `src/main.jsx` — `App`, `Cart`, `Checkout` |
| Header | The current header is a sticky rounded outer shell with a nested pill navigation, elevated shadow and compact order button. | `src/main.jsx` — `App`; `src/styles.css` — `.header`, `.nav`, `.nav-order` |
| Homepage hero | Current hero has a global dark image gradient, circular stamp, caption line and animated rings/sparks. | `src/main.jsx` — `Home`; `src/styles.css` — `.hero-image`, `.image-shade`, `.hero-motion`, `.round-stamp` |
| Content verification | The repository has editable placeholders for address, phone and hours, but `since: "1994"` is displayed in several marketing locations. | `src/data.js` — `restaurant`; `src/main.jsx` — `Home`, `About`, `Footer` |

## Checklist

### Preserve

- Hash navigation, accessible mobile menu and labelled cart count.
- Local-only cart, checkout, payment simulation, order confirmation, review and dashboard flows.
- One shared cart-total calculation, immutable order snapshots and duplicate-order prevention.
- Existing local food images, image fallback and asset-credit page.

### Awaiting owner verification

- Address, telephone number and opening hours.
- Founding-year claim: `Since 1994` was observed in the public Instagram bio but is not owner-verified in this project.
- Production menu, dish descriptions, pricing, delivery rules and testimonials.
- Restaurant history, team/kitchen/frontage imagery and any attributed owner quote.
- Whether a silent kitchen/serving video and any watermarked photography are approved for this use.

### Implement now

- Centralise the supplied visual tokens, test Fraunces 600 with DM Sans, simplify header and footer, and remove unverified year copy from customer-facing shell.
- Rebuild the homepage hero and section rhythm within the existing React/Vite structure.
- Add route-heading focus handling and sticky-header scroll offset while keeping the ordering state unchanged.

### Transaction-state risks to avoid

- Do not introduce network-backed payments, QR codes, real card fields or outbound messaging.
- Do not split totals into page-specific calculations.
- Do not clear cart/customer draft during a visual navigation change.
- Do not let route focus changes interfere with checkout field validation focus.
