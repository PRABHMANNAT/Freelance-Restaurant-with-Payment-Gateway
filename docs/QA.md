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
