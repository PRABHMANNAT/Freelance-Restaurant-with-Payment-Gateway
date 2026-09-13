export const STORAGE_KEY = "kdd-demo-v1";
export const emptyCustomer = {
  name: "",
  phone: "",
  alternate: "",
  email: "",
  address: "",
  pincode: "",
  instructions: "",
};
export const sampleCustomer = {
  name: "Aarav Mehra",
  phone: "9876543210",
  alternate: "",
  email: "aarav.demo@example.com",
  address: "24, Sample Garden Lane, Demo Colony, Amritsar",
  pincode: "143001",
  instructions:
    "Fictional walkthrough order. Please keep the food mildly spiced.",
};
export function calculateTotals(items) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 799 ? 0 : 40;
  return { subtotal, delivery, total: subtotal + delivery };
}
export function validateCustomer(c) {
  const e = {};
  if (c.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[6-9]\d{9}$/.test(c.phone))
    e.phone = "Enter a 10-digit Indian mobile number starting with 6–9.";
  if (c.alternate && !/^[6-9]\d{9}$/.test(c.alternate))
    e.alternate = "Enter a valid 10-digit alternate mobile number.";
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email))
    e.email = "Enter a valid email address.";
  if (c.address.trim().length < 10)
    e.address =
      "Add your house number, street, and city (at least 10 characters).";
  if (!/^[1-9]\d{5}$/.test(c.pincode))
    e.pincode = "Enter a valid 6-digit Indian pincode.";
  return e;
}
export function createOrder(items, customer, method, id) {
  return {
    id,
    timestamp: new Date().toISOString(),
    customer: { ...customer },
    items: items.map((i) => ({ ...i })),
    ...calculateTotals(items),
    method,
    paymentStatus: method === "COD" ? "Pending — COD" : "Paid — simulated",
    status: "Confirmed — demo",
    estimate: "35–45 minutes (demo estimate)",
  };
}
export function readSaved() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (s && typeof s === "object")
      return {
        cart: s.cart && typeof s.cart === "object" ? s.cart : {},
        orders: Array.isArray(s.orders) ? s.orders : [],
        reviews: Array.isArray(s.reviews) ? s.reviews : [],
        customer: { ...emptyCustomer, ...s.customer },
      };
  } catch {}
  return { cart: {}, orders: [], reviews: [], customer: { ...emptyCustomer } };
}
export const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export const itemText = (o) =>
  o.items.map((i) => `${i.name} × ${i.quantity}`).join(", ");
export function notification(o, owner) {
  return owner
    ? `New order at Kale Da Dhaba!\n\nOrder: ${o.id}\nCustomer: ${o.customer.name}\nPhone: ${o.customer.phone}\n\n${itemText(o)}\n\nTotal: ${money(o.total)}\nPayment: ${o.method} · ${o.paymentStatus}\n\nDeliver to: ${o.customer.address}\nPincode: ${o.customer.pincode}${o.customer.instructions ? "\n\nInstructions: " + o.customer.instructions : ""}`
    : `Hi ${o.customer.name}, your Kale Da Dhaba order is confirmed!\n\nOrder: ${o.id}\n${itemText(o)}\n\nTotal: ${money(o.total)}\nPayment: ${o.method} · ${o.paymentStatus}\nEstimated arrival: ${o.estimate}\n\nThank you for choosing a little Punjabi comfort. Taste you trust!`;
}
