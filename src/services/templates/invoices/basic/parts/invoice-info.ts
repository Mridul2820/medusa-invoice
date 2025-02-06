import dayjs from "dayjs";
import path from "path";
import { Invoice } from "../../../../../models/invoice";
import { amountToDisplay } from "./table";
import { Order } from "@medusajs/medusa";

export function generateInvoiceInformation(
  doc,
  y: number,
  invoice: Invoice,
  order: Order
): number {
  doc.registerFont(
    "Regular",
    path.resolve(__dirname, "../../../../../fonts/NotoSans-Regular.ttf")
  );
  doc.registerFont(
    "Bold",
    path.resolve(__dirname, "../../../../../fonts/NotoSans-Bold.ttf")
  );
  doc.font("Regular");

  doc.fillColor("#444444").fontSize(32).text("INVOICE", 40, 50, {
    align: "right",
  });

  doc.fontSize(14).text(invoice.display_number, 40, 86, {
    align: "right",
  });

  const startX = 180;
  const startY = 120;
  const lineSpacing = 25;

  const invoiceDetails = [
    {
      label: "Date:",
      value: dayjs(invoice?.created_at).format("MMM DD, YYYY"),
    },
    {
      label: "Payment Terms:",
      value: order?.payment_status,
    },
    {
      label: "Due Date:",
      value: dayjs(invoice?.created_at).format("MMM DD, YYYY"),
    },
    { label: "PO Number:", value: "NA" },
    {
      label: "Balance Due:",
      value:
        order?.payment_status === "captured"
          ? "₹0.00"
          : amountToDisplay(order?.total, order?.currency_code),
    },
  ];

  let currentY = startY;

  const labelStyle = {
    font: "Helvetica",
    fontSize: 10,
    color: "#666666",
  };

  const valueStyle = {
    font: "Helvetica",
    fontSize: 10,
    color: "#000000",
  };

  invoiceDetails.forEach((detail, index) => {
    doc
      .font(labelStyle.font)
      .fontSize(labelStyle.fontSize)
      .fillColor(labelStyle.color)
      .text(detail.label, startX + 170, currentY, { align: "left" });

    doc
      .font(valueStyle.font)
      .fontSize(valueStyle.fontSize)
      .fillColor(valueStyle.color)
      .text(detail.value, startX + 10, currentY, { align: "right" });

    if (detail.label === "Balance Due:") {
      doc.roundedRect(startX + 150, currentY - 5, 220, 25, 3).fill("#f5f5f5");

      doc
        .font(labelStyle.font)
        .fontSize(labelStyle.fontSize)
        .fillColor("#000000")
        .text(detail.label, startX + 170, currentY + 3, { align: "left" })
        .font(valueStyle.font)
        .fontSize(valueStyle.fontSize)
        .fillColor("#000000")
        .text(detail.value, startX + 10, currentY + 3, { align: "right" });
    }

    currentY += lineSpacing;
  });

  return currentY;
}
