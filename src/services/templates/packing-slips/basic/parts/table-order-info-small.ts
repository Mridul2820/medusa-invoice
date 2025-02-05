import { LineItem, Order } from "@medusajs/medusa";
import { generateHrInA7 } from "./hr";

function generateTableRow(doc, y, orderNumber, orderDate, shippingMethod) {
  doc
    .fontSize(6)
    .text(orderNumber, 25, y)
    .text(orderDate, 80, y)
    .text(shippingMethod, 90, y, { align: "right", width: 100 });
}

export function generateOrderInfoTable(
  doc,
  y,
  order: Order,
  items: LineItem[]
): number {
  const invoiceTableTop = y + 25;

  generateTableRow(
    doc,
    invoiceTableTop,
    "Order #",
    "Order date",
    "Shipping method"
  );
  generateHrInA7(doc, invoiceTableTop + 10);

  const position = invoiceTableTop + 20;

  generateTableRow(
    doc,
    position,
    order.display_id,
    order.created_at.toLocaleDateString(),
    order.shipping_methods[0].shipping_option.name
  );

  generateHrInA7(doc, position + 10);

  return position + 10;
}
