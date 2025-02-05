import { LineItem, Order } from "@medusajs/medusa";
import { generateHr } from "./hr";

function generateTableRow(doc, y, orderNumber, orderDate, shippingMethod) {
  doc
    .fontSize(10)
    .text(orderNumber, 50, y)
    .text(orderDate, 200, y)
    .text(shippingMethod, 0, y, { align: "right" });
}

export function generateOrderInfoTable(
  doc,
  y,
  order: Order,
  items: LineItem[]
): number {
  let i;
  const invoiceTableTop = y + 35;

  generateTableRow(
    doc,
    invoiceTableTop,
    "Order #",
    "Order date",
    "Shipping method"
  );
  generateHr(doc, invoiceTableTop + 20);

  const position = invoiceTableTop + 30;

  generateTableRow(
    doc,
    position,
    order.display_id,
    order.created_at.toLocaleDateString(),
    order.shipping_methods[0].shipping_option.name
  );

  generateHr(doc, position + 20);

  return position + 20;
}
