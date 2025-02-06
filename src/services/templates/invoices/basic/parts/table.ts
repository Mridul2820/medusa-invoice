import { LineItem, Order } from "@medusajs/medusa";
import { OrderStatus } from "@medusajs/utils";
import { getDecimalDigits } from "../../../../utils/currency";

function amountToDisplay(amount: number, currencyCode: string): string {
  const decimalDigits = getDecimalDigits(currencyCode);
  return `₹${(amount / Math.pow(10, decimalDigits)).toFixed(decimalDigits)}`;
}

function generateTableRow(doc, y, item, quantity, unitCost, lineTotal, bg) {
  if (bg) {
    doc
      .roundedRect(50, y - 5, 500, 20, 5)
      .fillColor("#000000")
      .fill();
    doc.fillColor("#FFFFFF");
  } else {
    doc.fillColor("#000000");
  }

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(item, 58, y)
    .font("Helvetica")
    .text(quantity, 250, y, { width: 90, align: "left" })
    .text(unitCost, 350, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

export function generateInvoiceTable(doc, y, order: Order, items: LineItem[]) {
  let i;
  const invoiceTableTop = y + 15;

  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Quantity",
    "Rate",
    "Amount",
    true
  );

  for (i = 0; i < items.length; i++) {
    const item = items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      item.quantity,
      amountToDisplay(item.total / item.quantity, order.currency_code),
      amountToDisplay(item.total, order.currency_code),
      false
    );
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30 + 10;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal:",
    amountToDisplay(order.subtotal, order.currency_code),
    false
  );

  const shippingPosition = subtotalPosition + 22;
  generateTableRow(
    doc,
    shippingPosition,
    "",
    "",
    "Shipping:",
    amountToDisplay(order.shipping_total, order.currency_code),
    false
  );

  const taxsgstPosition = shippingPosition + 22;
  generateTableRow(
    doc,
    taxsgstPosition,
    "",
    "",
    "CGST (9%):",
    amountToDisplay(order.tax_total / 2, order.currency_code),
    false
  );

  const taxcgstPosition = taxsgstPosition + 22;
  generateTableRow(
    doc,
    taxcgstPosition,
    "",
    "",
    "SGST (9%):",
    amountToDisplay(order.tax_total / 2, order.currency_code),
    false
  );

  const totalPosition = taxcgstPosition + 22;
  generateTableRow(
    doc,
    totalPosition,
    "",
    "",
    "Total:",
    amountToDisplay(order.total, order.currency_code),
    false
  );

  const duePosition = totalPosition + 22;
  generateTableRow(
    doc,
    duePosition,
    "",
    "",
    "Amount Paid:",
    order?.status === ("captured" as OrderStatus)
      ? "₹0.00"
      : amountToDisplay(order.total, order.currency_code),
    false
  );

  return duePosition + 30;
}
