# Verification record

Checked on 14 September 2026 in the Codex browser against the local Vite demo.

## Build and logic

- Production Vite build succeeds.
- Four domain tests pass: delivery threshold/empty totals; required and optional validation; immutable order snapshots; matching payment/message content.
- All menu images and both font families are local assets. No runtime dependency on Instagram, image CDNs, or Google Fonts.

## Browser walkthrough

- Desktop homepage visually inspected, including the brand monogram, hero photography, typography, and navigation.
- Veg filter + “paneer” search returns Paneer Lababdar and Paneer Tikka Wrap.
- Non-Veg returns Butter Chicken, Chicken Tikka Wrap, and Chicken Biryani.
- Breads and Desserts category filters work.
- Cart quantity adjustment and refresh persistence verified. One Paneer Lababdar + two Garlic Butter Naans gives subtotal ₹460, delivery ₹40, total ₹500.
- Required-field validation shown for name, phone, address, and pincode.
- Fill Sample Details populates fictional details. Details survive going back from payment.
- UPI failure retains bag/details, then success places exactly one ₹500 order despite double-clicking.
- COD double-click places exactly one ₹420 order with Pending — COD.
- Card uses fixed non-editable test details, accepts failure/retry, and places exactly one ₹300 order despite double-clicking. No card input fields exist in the mock panel.
- Confirmation includes customer, items, quantity, total, payment method/status, and labelled demo delivery estimate.
- Dashboard contained exactly three corresponding rows. Both WhatsApp messages agreed with the selected order. Selecting the older UPI order updated both previews to ₹500.
- A four-star written review was saved, displayed, and retained after refresh. Double-click produced one review. A second review for that order was unavailable.
- Removing the final cart item produces the empty-cart state.
- Reset cancellation preserves all three orders. Confirmed reset clears orders, reviews, cart, and customer draft; zero dashboard counters persist after refresh.
- Mobile viewport 390 × 844 checked for homepage, navigation, About, Gallery, Contact, checkout, confirmation, and dashboard. No horizontal document overflow observed. Fixed card number typography was refined after visual inspection.
- Drawer traps keyboard focus, uses inert background content, and supports Escape; forms have explicit labels and visible focus styles.

The browser was returned to a clean homepage, ready for recording.

## Expected limitations

- Browser-local demonstration only; different browsers/devices do not share orders.
- Instagram reels required sign-in, so no video was embedded. Supplied photography is the reliable fallback.
- Sample dishes/prices, testimonials, and extended story are labelled demo content. Contact details await verification.
- This is functional/visual QA for the requested demo, not a full production accessibility or security audit.

## Shared-foundation and homepage revision

Checked on 14 September 2026 using the refreshed local Vite app.

- Captured pre-change browser baselines at 1440 × 900 and 390 × 844. The previous view used a rounded floating header, nested pill navigation, global hero image shade, circular seal and decorative motion.
- Verified the revised header and footer at 1440 px, 768 px and 390 px. Desktop presents plain links and an active underline; tablet and mobile expose the labelled menu toggle and retained cart count.
- The revised 390 px hero keeps the order actions before a 4:3 food image, uses 20 px gutters and does not reduce the primary action below the shared 50 px control height.
- The revised 1440 px hero uses the requested 5/7 split, an intentional food crop, no global dark gradient and one 88 px signboard-style stamp. The source is the existing locally supplied food photo, so its original watermark status is preserved.
- Reduced-motion rules already disable animation and transitions. The current revision no longer renders looping hero or floating-dish decoration.
- Route changes scroll to the top and then move focus to the route heading. Checkout validation continues to focus the first field with an error; the cart focus trap is unchanged.
- `npm test` passes all four domain tests. `npm run build` succeeds when run outside the restricted sandbox, as required by esbuild to resolve this workspace path.

### Next owner-approved photos to request

1. A clean close serving shot showing a hot tandoor bread or dal being plated, with no customer faces or third-party watermark.
2. A daylight exterior or recognisable entrance/signage photo for the Amritsar location, supplied with permission for website use.

## About and menu revision

- The About page now uses an interim introduction because no owner-approved restaurant history, dated milestones, kitchen/team/frontage photograph, signature-dish detail or attributed owner quote is available in this repository. The observed public Instagram “since 1994” line is recorded as unverified and is not displayed as history.
- The menu remains a 16-item demonstration dataset. Its dish names, descriptions, prices, images and Pizza/Pasta categorisation still await owner confirmation; the UI does not infer allergens, egg-free status, no-onion/no-garlic preparation, spice levels, portions or modifiers.
- Search clearing was reproduced through the visible clear button. The revised input also clears on Escape; neither path resets selected category or diet, so valid filter intersections are preserved. The visible reset action clears all three controls only in the no-results state.
- Mobile menu cards are compact horizontal rows with a 112 px image and a 44 px Add/quantity action. The existing mobile cart summary remains fixed above the safe-area region and reads item count, subtotal and View cart.
