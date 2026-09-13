import { test } from "node:test";
import assert from "node:assert/strict";
import {
  calculateTotals,
  validateCustomer,
  sampleCustomer,
  deliveryConfig,
  isServiceablePincode,
  createOrder,
  notification,
} from "./domain.js";
test("totals include delivery below threshold and waive it at 799", () => {
  assert.deepEqual(calculateTotals([]), { subtotal: 0, delivery: 0, total: 0 });
  assert.equal(calculateTotals([{ price: 260, quantity: 2 }]).total, 560);
  assert.deepEqual(calculateTotals([{ price: 260, quantity: 1 }, { price: 70, quantity: 1 }]), { subtotal: 330, delivery: 40, total: 370 });
  assert.equal(calculateTotals([{ price: 798, quantity: 1 }]).delivery, deliveryConfig.fee);
  assert.equal(calculateTotals([{ price: 799, quantity: 1 }]).delivery, 0);
  assert.equal(calculateTotals([{ price: 800, quantity: 1 }]).delivery, 0);
});
test("customer validation covers required fields and optional formats", () => {
  assert.deepEqual(validateCustomer(sampleCustomer), {});
  const errors = validateCustomer({
    ...sampleCustomer,
    name: " ",
    phone: "123",
    address: " ",
    pincode: "12345",
    alternate: "invalid",
    email: "not-an-email",
  });
  assert.deepEqual(
    Object.keys(errors).sort(),
    ["name", "phone", "address", "pincode", "alternate", "email"].sort(),
  );
  assert.ok(validateCustomer({ ...sampleCustomer, phone: "1234567890" }).phone);
  assert.ok(validateCustomer({ ...sampleCustomer, pincode: "012345" }).pincode);
  assert.ok(validateCustomer({ ...sampleCustomer, pincode: "110001" }).pincode);
  assert.equal(isServiceablePincode("143001"), true);
  assert.equal(isServiceablePincode("110001"), false);
});
test("order snapshots do not mutate when cart or customer changes", () => {
  const items = [{ id: "dal", name: "Dal Makhani", price: 260, quantity: 2 }];
  const customer = { ...sampleCustomer };
  const order = createOrder(items, customer, "COD", "KDD-TEST");
  items[0].quantity = 9;
  customer.name = "Changed";
  assert.equal(order.items[0].quantity, 2);
  assert.equal(order.customer.name, sampleCustomer.name);
  assert.equal(order.total, 560);
  assert.equal(order.paymentStatus, "Pending — COD");
});
test("payment status and both messages derive from the same order", () => {
  for (const method of ["UPI", "Card"]) {
    const o = createOrder(
      [{ id: "dal", name: "Dal Makhani", price: 260, quantity: 2 }],
      sampleCustomer,
      method,
      "KDD-TEST",
    );
    assert.equal(o.paymentStatus, "Paid — simulated");
    for (const owner of [true, false]) {
      const message = notification(o, owner);
      for (const text of [
        o.id,
        o.customer.name,
        "Dal Makhani × 2",
        "₹560",
        o.paymentStatus,
      ])
        assert.ok(message.includes(text));
    }
    assert.ok(notification(o, true).includes(o.customer.pincode));
    assert.ok(notification(o, false).includes("35–45 minutes (demo estimate)"));
  }
});
