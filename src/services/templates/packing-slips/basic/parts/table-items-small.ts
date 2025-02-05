import { LineItem, Order } from "@medusajs/medusa";
import { generateHrInA7 } from "./hr";

function generateTableRow(doc, y, item, description, quantity) {
  doc
    .fontSize(6)
    .text(item, 25, y)
    .text(description, 80, y)
    .text(quantity, 90, y, { align: "right", width: 100 });
}

export function generateItemsTable(doc, y, order: Order, items: LineItem[]) {
  let i;
  const invoiceTableTop = y + 25;

  let totalQuantity = 0;

  generateTableRow(doc, invoiceTableTop, "Item", "Description", "Quantity");
  generateHrInA7(doc, invoiceTableTop + 10);

  for (i = 0; i < items.length; i++) {
    const item = items[i];
    totalQuantity += item.quantity;
    const position = invoiceTableTop + (i + 1) * 20;
    generateTableRow(
      doc,
      position,
      item.title,
      item.description,
      item.quantity
    );

    generateHrInA7(doc, position + 10);
  }

  const totalQuantityPosition = invoiceTableTop + (i + 1) * 20;
  generateTableRow(doc, totalQuantityPosition, "", "Total", totalQuantity);
}
