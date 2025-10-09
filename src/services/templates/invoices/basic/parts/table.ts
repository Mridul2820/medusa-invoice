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

  const invoiceTableTop = y + 10;

  // Check if order is after October 8th, 2025 and from Maharashtra
  const cutoffDate = new Date("2025-10-08T00:00:00Z");
  const orderDate = order.created_at ? new Date(order.created_at) : null;
  const isAfterCutoff =
    orderDate instanceof Date &&
    !isNaN(orderDate.getTime()) &&
    orderDate.getTime() > cutoffDate.getTime();
  const isMaharashtra =
    order.shipping_address?.province?.toLowerCase() === "maharashtra";
  const shouldShowIGST = isAfterCutoff && !isMaharashtra;

  // Header row
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

  let position = invoiceTableTop;
  let totalTax = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Item row
    position += 24;
    generateTableRow(
      doc,
      position,
      item?.variant?.title,
      item?.variant?.hs_code,
      item.quantity,
      "Unit Price (Before GST)",
      amountToDisplay(item.unit_price, order.currency_code),
      false,
      false
    );

    if (shouldShowIGST) {
      // IGST row
      position += 16;
      generateTableRow(
        doc,
        position,
        "",
        "",
        "",
        `IGST (${item.tax_lines?.[0]?.rate}%)`,
        amountToDisplay(
          Math.round(item.original_tax_total),
          order.currency_code
        ),
        false,
        false
      );
    } else {
      // CGST row
      position += 16;
      generateTableRow(
        doc,
        position,
        "",
        "",
        "",
        `CGST (${item.tax_lines?.[0]?.rate / 2}%)`,
        amountToDisplay(
          Math.round(item.original_tax_total / 2),
          order.currency_code
        ),
        false,
        false
      );

      // SGST row
      position += 16;
      generateTableRow(
        doc,
        position,
        "",
        "",
        "",
        `SGST (${item.tax_lines?.[0]?.rate / 2}%)`,
        amountToDisplay(
          Math.round(item.original_tax_total / 2),
          order.currency_code
        ),
        false,
        false
      );
    }

    totalTax += item.original_tax_total;
  }

  // Subtotal row
  position += 30;
  generateTableRow(
    doc,
    position,
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

  // Total (incl. GST)
  position += 22;
  generateTableRow(
    doc,
    position,
    "",
    "",
    "",
    "Total (incl. GST)",
    amountToDisplay(order.subtotal + totalTax, order.currency_code),
    false,
    true
  );

  // Discount (if any)
  if (order.discounts.length > 0) {
    position += 22;

    const discount = order.discounts[0];
    let discountLabel = "Discount";
    let discountValue = 0;

    if (discount.rule?.type === "percentage") {
      discountLabel += ` (${discount.rule?.value}%)`;
      discountValue =
        (order.subtotal + totalTax) * (discount.rule?.value / 100);
    } else if (discount.rule?.type === "fixed") {
      discountLabel += ` (${discount.rule?.value / 100})`;
      discountValue = discount.rule?.value;
    } else if (discount.rule?.type === "free_shipping") {
      discountLabel += ` (Free Shipping)`;
      discountValue =
        order?.shipping_methods?.[0]?.price +
          order?.shipping_methods?.[0]?.tax_lines?.[0]?.rate || 0;
    }

    generateTableRow(
      doc,
      position,
      "",
      "",
      "",
      discountLabel,
      "-" + amountToDisplay(discountValue, order.currency_code),
      false,
      false
    );
  }

  // Shipping Fee
  position += 22;
  generateTableRow(
    doc,
    position,
    "",
    "",
    "",
    "Shipping Fee (Flat)",
    amountToDisplay(
      order?.discounts[0]?.code === "SISTERHOOD" ||
        order?.discounts[0]?.code === "SISTER-HOOD"
        ? 0
        : order.metadata?.isCod &&
          Math.round(
            (order?.shipping_methods[0]?.price + order?.shipping_tax_total) /
              100
          ) >
            (order?.shipping_methods[0]?.shipping_option?.metadata
              ?.cod_charges as number)
        ? (order?.shipping_methods[0]?.price + order?.shipping_tax_total) / 3
        : 0,
      order.currency_code
    ),
    false,
    false
  );

  // COD Charges
  position += 22;
  generateTableRow(
    doc,
    position,
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

  // Final Total Payable
  position += 22;
  generateTableRow(
    doc,
    position,
    "",
    "",
    "",
    "Total Payable",
    amountToDisplay(Math.round(order.total), order.currency_code),
    false,
    true
  );

  return position + 30;
}
