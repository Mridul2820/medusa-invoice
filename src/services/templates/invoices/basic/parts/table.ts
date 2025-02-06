import { LineItem, Order } from "@medusajs/medusa";
import path from "path";
import { getDecimalDigits } from "../../../../utils/currency";

export const amountToDisplay = (
  amount: number,
  currencyCode: string
): string => {
  const decimalDigits = getDecimalDigits(currencyCode);
  return `₹${(amount / Math.pow(10, decimalDigits)).toFixed(decimalDigits)}`;
};

function generateTableRow(doc, y, item, quantity, unitCost, lineTotal, bg) {
  if (bg) {
    doc
      .roundedRect(50, y - 3, 500, 20, 3)
      .fillColor("#000000")
      .fill();
    doc.fillColor("#FFFFFF");
  } else {
    doc.fillColor("#000000");
  }

  doc
    .fontSize(10)
    .font("Bold")
    .text(item, 58, y)
    .font("Regular")
    .text(quantity, 250, y, { width: 90, align: "left" })
    .text(unitCost, 340, y, { width: 130, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

export function generateInvoiceTable(doc, y, order: Order, items: LineItem[]) {
  doc.registerFont(
    "Regular",
    path.resolve(__dirname, "../../../../../fonts/NotoSans-Regular.ttf")
  );
  doc.registerFont(
    "Bold",
    path.resolve(__dirname, "../../../../../fonts/NotoSans-Bold.ttf")
  );
  doc.font("Regular");

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

  const subtotalPosition = invoiceTableTop + (i + 1) * 30 + 5;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Subtotal:",
    amountToDisplay(order.subtotal, order.currency_code),
    false
  );

  const discountPosition = subtotalPosition + 22;
  generateTableRow(
    doc,
    discountPosition,
    "",
    "",
    "Discount:",
    amountToDisplay(order.discount_total, order.currency_code),
    false
  );

  const shippingPosition = discountPosition + 22;
  generateTableRow(
    doc,
    shippingPosition,
    "",
    "",
    "Shipping:",
    amountToDisplay(order.shipping_total, order.currency_code),
    false
  );

  const taxcgstPosition = shippingPosition + 22;
  generateTableRow(
    doc,
    taxcgstPosition,
    "",
    "",
    "CGST (9%):",
    amountToDisplay(order.tax_total / 2, order.currency_code),
    false
  );

  const taxsgstPosition = taxcgstPosition + 22;
  generateTableRow(
    doc,
    taxsgstPosition,
    "",
    "",
    "SGST (9%):",
    amountToDisplay(order.tax_total / 2, order.currency_code),
    false
  );

  const orgTaxPosition = taxsgstPosition + 22;
  generateTableRow(
    doc,
    orgTaxPosition,
    "",
    "",
    "Original Price(Incl Tax):",
    amountToDisplay(
      order.subtotal + order.tax_total + order.shipping_total,
      order.currency_code
    ),
    false
  );

  const totalPosition = orgTaxPosition + 22;
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
    amountToDisplay(order.paid_total, order.currency_code),
    false
  );

  return duePosition + 30;
}
