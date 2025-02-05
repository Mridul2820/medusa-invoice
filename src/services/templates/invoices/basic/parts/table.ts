import { LineItem, Order } from "@medusajs/medusa";
import { generateHr } from "./hr";
import { getDecimalDigits } from "../../../../utils/currency";

function amountToDisplay(amount: number, currencyCode: string): string {
  const decimalDigits = getDecimalDigits(currencyCode);
  return `${(amount / Math.pow(10, decimalDigits)).toFixed(
    decimalDigits
  )} ${currencyCode.toUpperCase()}`;
}

function generateTableRow(doc, y, item, unitCost, quantity, lineTotal) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

export function generateInvoiceTable(doc, y, order: Order, items: LineItem[]) {
  let i;
  const invoiceTableTop = y + 35;

  generateTableRow(doc, invoiceTableTop, "Item", "Quantity", "Rate", "Amount");
  generateHr(doc, invoiceTableTop + 20);

  for (i = 0; i < items.length; i++) {
    const item = items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      item.quantity,
      amountToDisplay(item.total / item.quantity, order.currency_code),
      amountToDisplay(item.total, order.currency_code)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Shipping",
    amountToDisplay(order.shipping_total, order.currency_code)
  );

  const taxPosition = subtotalPosition + 30;
  generateTableRow(
    doc,
    taxPosition,
    "",
    "",
    "GST (12%):",
    amountToDisplay(order.tax_total, order.currency_code)
  );

  const duePosition = taxPosition + 45;
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Total",
    amountToDisplay(order.total, order.currency_code)
  );

  return duePosition + 30;
}
