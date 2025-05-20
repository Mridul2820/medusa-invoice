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

function generateTableRow(
  doc,
  y,
  item,
  hsn,
  quantity,
  unitCost,
  lineTotal,
  bg,
  bold
) {
  if (bg) {
    doc
      .roundedRect(50, y - 3, 500, 20, 3)
      .fillColor("#000000")
      .fill();
    doc.fillColor("#FFFFFF");
  } else {
    doc.fillColor("#000000");
  }

  if (bold) {
    doc.font("Bold");
  } else {
    doc.font("Regular");
  }

  doc
    .fontSize(10)
    .font("Bold")
    .text(item, 58, y)
    .font("Regular")
    .text(hsn, 240, y, { width: 60, align: "left" })
    .text(quantity, 300, y, { width: 90, align: "left" })
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
    "HSN",
    "Quantity",
    "Description",
    "Amount(₹)",
    true,
    false
  );

  for (i = 0; i < items.length; i++) {
    const item = items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.title,
      "21069099",
      item.quantity,
      "Unit Price (Before GST)",
      amountToDisplay(item.unit_price, order.currency_code),
      false,
      false
    );
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30 + 5;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    `Subtotal (${order.items.length} units)`,
    amountToDisplay(order.subtotal, order.currency_code),
    false,
    false
  );

  const taxcgstPosition = subtotalPosition + 22;
  generateTableRow(
    doc,
    taxcgstPosition,
    "",
    "",
    "",
    "CGST (9%):",
    amountToDisplay(order.subtotal * 0.09, order.currency_code),
    false,
    false
  );

  const taxsgstPosition = taxcgstPosition + 22;
  generateTableRow(
    doc,
    taxsgstPosition,
    "",
    "",
    "",
    "SGST (9%):",
    amountToDisplay(order.subtotal * 0.09, order.currency_code),
    false,
    false
  );

  const totalPosition = taxsgstPosition + 22;
  generateTableRow(
    doc,
    totalPosition,
    "",
    "",
    "",
    "Total (incl. GST)",
    amountToDisplay(order.subtotal * 1.18, order.currency_code),
    false,
    true
  );

  const discountPosition = totalPosition + 22;
  generateTableRow(
    doc,
    discountPosition,
    "",
    "",
    "",
    `Discount (${
      order.discounts[0]?.rule?.type === "percentage"
        ? order.discounts[0]?.rule?.value + "%"
        : order.discounts[0]?.rule?.value / 100
    })`,
    "-" +
      amountToDisplay(
        order.discounts[0]?.rule?.type === "percentage"
          ? (order.subtotal * 1.18 * (order.discounts[0]?.rule?.value / 100)) /
              100
          : (order.subtotal * 1.18 - order.discounts[0]?.rule?.value) / 100,
        order.currency_code
      ),
    false,
    false
  );

  const shippingFeePosition = discountPosition + 22;
  generateTableRow(
    doc,
    shippingFeePosition,
    "",
    "",
    "",
    "Shipping Fee (Flat)",
    amountToDisplay(150, order.currency_code),
    false,
    false
  );

  const codFeePosition = shippingFeePosition + 22;
  generateTableRow(
    doc,
    codFeePosition,
    "",
    "",
    "",
    order.payments[0].provider_id === "manual" ? "COD Charges" : "",
    order.payments[0].provider_id === "manual"
      ? amountToDisplay(150, order.currency_code)
      : "",
    false,
    false
  );

  const totalPayPosition =
    order.payments[0].provider_id === "manual"
      ? codFeePosition + 22
      : shippingFeePosition + 22;
  generateTableRow(
    doc,
    totalPayPosition,
    "",
    "",
    "",
    "Total Payable",
    amountToDisplay(order.total, order.currency_code),
    false,
    true
  );

  return totalPayPosition + 30;
}
