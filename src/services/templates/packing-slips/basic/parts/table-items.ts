import { LineItem, Order } from "@medusajs/medusa";
import { generateHr } from "./hr";

function generateTableRow(doc, y, item, description, quantity) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 200, y)
    .text(quantity, 0, y, { align: "right" });
}

export function generateItemsTable(doc, y, order: Order, items: LineItem[]) {
  let i;
  const invoiceTableTop = y + 35;

  let totalQuantity = 0;

  generateTableRow(doc, invoiceTableTop, "Item", "Description", "Quantity");
  generateHr(doc, invoiceTableTop + 20);

  for (i = 0; i < items.length; i++) {
    const item = items[i];
    totalQuantity += item.quantity;
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      item.description,
      item.quantity
    );

    generateHr(doc, position + 20);
  }

  const totalQuantityPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(doc, totalQuantityPosition, "", "Total", totalQuantity);
}
