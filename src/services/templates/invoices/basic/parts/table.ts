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

// helper to resolve effective rate
function getEffectiveTaxRate(order: Order, fallbackRate: number) {
  const cutoff = new Date("2025-09-25T00:00:00Z");
  const createdAt = new Date(order.created_at);

  if (createdAt < cutoff) {
    return fallbackRate;
  }

  // else fetch from first item tax line
  const firstItemTaxLine = order.items?.[0]?.tax_lines?.[0];
  return firstItemTaxLine ? firstItemTaxLine.rate / 2 : fallbackRate;
}

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
      .fillColor("#111111")
      .fill();
    doc.fillColor("#FFFFFF");
  } else {
    doc.fillColor("#111111");
  }

  doc
    .fontSize(10)
    .font("Bold")
    .text(item, 58, y)
    .font(bold ? "Bold" : "Regular")
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
      item?.variant?.hs_code,
      item.quantity,
      "Unit Price (Before GST)",
      amountToDisplay(item.unit_price, order.currency_code),
      false,
      false
    );
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    `Subtotal (${items.reduce((acc, item) => acc + item.quantity, 0)} ${
      items.reduce((acc, item) => acc + item.quantity, 0) > 1 ? "units" : "unit"
    })`,
    amountToDisplay(order.subtotal, order.currency_code),
    false,
    false
  );
  const cgstRate = getEffectiveTaxRate(order, 9);
  const taxcgstPosition = subtotalPosition + 22;
  generateTableRow(
    doc,
    taxcgstPosition,
    "",
    "",
    "",
    `CGST (${cgstRate}%):`,
    amountToDisplay(order.tax_total / 2, order.currency_code),
    false,
    false
  );
  const sgstRate = getEffectiveTaxRate(order, 9);
  const taxsgstPosition = taxcgstPosition + 22;
  generateTableRow(
    doc,
    taxsgstPosition,
    "",
    "",
    "",
    `SGST (${sgstRate}%):`,
    amountToDisplay(order.tax_total / 2, order.currency_code),
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
    amountToDisplay(order.subtotal + order.item_tax_total, order.currency_code),
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
    order.discounts.length > 0
      ? `Discount${` (${
          order.discounts[0]?.rule?.type === "percentage"
            ? order.discounts[0]?.rule?.value + "%"
            : order.discounts[0]?.rule?.value / 100
        })`}`
      : "",
    order.discounts.length > 0
      ? "-" +
          amountToDisplay(
            order.discounts[0]?.rule?.type === "percentage"
              ? (order.subtotal + order.tax_total) *
                  (order.discounts[0]?.rule?.value / 100)
              : order.subtotal +
                  order.tax_total -
                  order.discounts[0]?.rule?.value,
            order.currency_code
          )
      : "",
    false,
    false
  );

  const shippingFeePosition =
    order.discounts.length > 0 ? discountPosition + 22 : totalPosition + 22;

  generateTableRow(
    doc,
    shippingFeePosition,
    "",
    "",
    "",
    "Shipping Fee (Flat)",
    amountToDisplay(
      order?.discounts[0]?.code === "SISTERHOOD"
        ? 0
        : order.metadata?.isCod
        ? (order?.shipping_methods[0]?.price + order?.shipping_tax_total) / 3
        : order?.shipping_methods[0]?.price + order?.shipping_tax_total,
      order.currency_code
    ),
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
    order.payment_status === "captured" ? "" : "COD Charges",
    order.payment_status === "captured"
      ? ""
      : amountToDisplay(
          parseInt(
            order?.shipping_methods?.[0]?.shipping_option?.metadata
              ?.cod_charges as any
          ) * 100,
          order?.currency_code
        ),
    false,
    false
  );

  const totalPayPosition =
    order.payment_status === "captured"
      ? shippingFeePosition + 22
      : codFeePosition + 22;
  generateTableRow(
    doc,
    totalPayPosition,
    "",
    "",
    "",
    "Total Payable",
    amountToDisplay(Math.round(order.total), order.currency_code),
    false,
    true
  );

  return totalPayPosition + 30;
}
