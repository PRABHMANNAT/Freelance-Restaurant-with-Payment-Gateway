# Kale Da Dhaba — Restaurant ordering demo

A responsive, frontend-only client presentation built with React 19, Tailwind CSS 4, Vite, and Lucide icons. The design follows Kale Da Dhaba's olive monogram and food photography, with locally hosted images and fonts.

## Run

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. For a production build:

```sh
npm test
npm run build
npm run preview
```

The `dist/` directory can be served by any static host. Relative asset paths and hash navigation support subdirectory hosting, including GitHub Pages. No server, API key, database, account, or payment service is required.

## Walkthrough

1. Open Home, then Explore Menu.
2. Search for paneer, select Veg, and add Paneer Lababdar.
3. Clear the search, choose Breads, and add Garlic Butter Naan.
4. Open Cart and increase naan to two. The total is ₹500 including ₹40 demo delivery.
5. Proceed to Checkout. Click Continue with empty fields to demonstrate validation, then Fill Sample Details.
6. Continue to Payment. Choose UPI, simulate failure, then simulate success. Card has the same failure/retry flow; COD records Pending — COD.
7. Show the order confirmation, customer details, items, payment status, and illustrative estimate.
8. Use the discreet Demo Dashboard link in the footer to show the matching spreadsheet row and owner/customer WhatsApp previews. The order selector switches all previews together.
9. Go to Reviews, select the order, rate it, and submit a written review. The review appears locally and cannot be duplicated.
10. Refresh to demonstrate persistence. Use Reset Demo in the dashboard to prepare another recording.

## Editable content

- `src/data.js`: menu, categories, restaurant story, contact placeholders, sample reviews, and images.
- `src/domain.js`: delivery pricing, validation, order snapshot creation, sample customer, and message templates.
- `src/main.jsx`: page components and interaction state.
- `src/styles.css`: palette, typography, spacing, and responsive breakpoints.
- `public/assets/`: locally hosted brand and food images.
- `public/fonts/`: locally hosted Google Fonts and licenses.
- `docs/BRAND-RESEARCH.md`: sources and verified/placeholder boundaries.

## Demo behaviour

Cart, customer draft, orders, and submitted reviews are saved under the localStorage key `kdd-demo-v1`. Order items, customer details, totals, payment state, and timestamp are captured together when placing an order. Both WhatsApp previews and the spreadsheet table read that same snapshot. The checkout has a synchronous submission lock and order-ID deduplication.

Delivery is ₹40 below ₹799 and free from ₹799. Displayed prices are illustrative and include demo taxes. Phone numbers must contain ten digits starting with 6–9; pincodes must contain six digits starting with 1–9. Optional phone/email fields are validated when entered.

All orders, payments, delivery estimates, spreadsheet records, and WhatsApp messages are simulations. No real payment inputs, payable UPI QR codes, outbound notifications, or backend calls exist. Contact details, sample prices, extended history copy, and testimonials need restaurant verification before production use. Supplied food photos are illustrative; dish identification is not asserted as a verified menu.

## Validation

`npm test` covers pricing boundaries, required and optional customer validation, immutable order snapshots, and consistency of payment/message data. Browser QA covers the complete UPI, card, and COD journey, failed payment retry, duplicate clicks, review persistence, menu filters, cart operations, dashboard reset, and responsive layouts. See `docs/QA.md` for the verification record.

Photo and font credits are included in `public/credits.html`. Original supplied assets are preserved in `locally available image assests/`.
